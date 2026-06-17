import { Invoice } from '../../dominio/entidades/Fatura';
import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { RepositorioFatura } from '../../dominio/repositorios/RepositorioFatura';
import { Money } from '../../dominio/objetos-de-valor/Dinheiro';
import { GeradorDeIds } from '../portas/GeradorDeIds';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface CreateInvoiceInput {
  studentId: string;
  description: string;
  amountInCents: number;
  dueDate: string; // ISO
}

export interface InvoiceView {
  id: string;
  studentId: string;
  description: string;
  amount: string;
  amountInCents: number;
  dueDate: string;
  status: string;
}

/** Caso de uso: emitir uma fatura (mensalidade) para um aluno. */
export class CreateInvoice implements CasoDeUso<CreateInvoiceInput, InvoiceView> {
  constructor(
    private readonly faturas: RepositorioFatura,
    private readonly geradorDeIds: GeradorDeIds,
  ) {}

  async executar(entrada: CreateInvoiceInput): Promise<InvoiceView> {
    const vencimento = new Date(entrada.dueDate);
    if (Number.isNaN(vencimento.getTime())) {
      throw new DomainError(`Data de vencimento inválida: ${entrada.dueDate}`);
    }

    const fatura = Invoice.issue({
      id: this.geradorDeIds.gerar(),
      studentId: entrada.studentId,
      description: entrada.description,
      amount: Money.fromCents(entrada.amountInCents),
      dueDate: vencimento,
    });

    await this.faturas.save(fatura);
    return toView(fatura);
  }
}

export function toView(fatura: Invoice): InvoiceView {
  return {
    id: fatura.id,
    studentId: fatura.studentId,
    description: fatura.description,
    amount: fatura.amount.format(),
    amountInCents: fatura.amount.amountInCents,
    dueDate: fatura.dueDate.toISOString(),
    status: fatura.status,
  };
}
