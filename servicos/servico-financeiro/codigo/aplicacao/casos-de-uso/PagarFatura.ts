import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { FaturaPaga } from '../../dominio/eventos/FaturaPaga';
import { EstrategiaMultaAtraso } from '../../dominio/precificacao/EstrategiaMultaAtraso';
import { RepositorioFatura } from '../../dominio/repositorios/RepositorioFatura';
import { Relogio } from '../portas/Relogio';
import { PublicadorDeEventos } from '../portas/PublicadorDeEventos';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface PayInvoiceInput {
  invoiceId: string;
  paidAt?: string; // ISO; default = agora
}

export interface PaymentReceipt {
  invoiceId: string;
  studentId: string;
  baseAmount: string;
  lateFee: string;
  total: string;
  totalInCents: number;
  daysOverdue: number;
  paidAt: string;
  status: string;
}

/**
 * Caso de uso: pagar uma fatura. Calcula a multa por atraso via Strategy
 * injetada (Dependency Inversion), liquida a fatura no domínio e publica o
 * evento FaturaPaga (Observer) para os interessados.
 */
export class PayInvoice implements CasoDeUso<PayInvoiceInput, PaymentReceipt> {
  constructor(
    private readonly faturas: RepositorioFatura,
    private readonly multaPorAtraso: EstrategiaMultaAtraso,
    private readonly eventos: PublicadorDeEventos,
    private readonly relogio: Relogio,
  ) {}

  async executar(entrada: PayInvoiceInput): Promise<PaymentReceipt> {
    const fatura = await this.faturas.findById(entrada.invoiceId);
    if (!fatura) {
      throw new DomainError(`Fatura ${entrada.invoiceId} não encontrada`);
    }

    const pagoEm = entrada.paidAt ? new Date(entrada.paidAt) : this.relogio.agora();
    if (Number.isNaN(pagoEm.getTime())) {
      throw new DomainError(`Data de pagamento inválida: ${entrada.paidAt}`);
    }

    const diasEmAtraso = fatura.daysOverdue(pagoEm);
    const multa = this.multaPorAtraso.surcharge(fatura.amount, diasEmAtraso);
    const total = fatura.amount.add(multa);

    fatura.pay(total, pagoEm);
    await this.faturas.save(fatura);

    await this.eventos.publicar(
      new FaturaPaga(fatura.id, fatura.studentId, total.amountInCents, pagoEm),
    );

    return {
      invoiceId: fatura.id,
      studentId: fatura.studentId,
      baseAmount: fatura.amount.format(),
      lateFee: multa.format(),
      total: total.format(),
      totalInCents: total.amountInCents,
      daysOverdue: diasEmAtraso,
      paidAt: pagoEm.toISOString(),
      status: fatura.status,
    };
  }
}
