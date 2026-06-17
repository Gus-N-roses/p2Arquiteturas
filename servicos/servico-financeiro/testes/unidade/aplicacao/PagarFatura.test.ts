import { CreateInvoice } from '../../../codigo/aplicacao/casos-de-uso/EmitirFatura';
import { PayInvoice } from '../../../codigo/aplicacao/casos-de-uso/PagarFatura';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { FaturaPaga } from '../../../codigo/dominio/eventos/FaturaPaga';
import { StandardLateFee } from '../../../codigo/dominio/precificacao/EstrategiaMultaAtraso';
import { InMemoryRepositorioFatura } from '../../../codigo/infraestrutura/repositorios/RepositorioFaturaEmMemoria';
import { PublicadorDeEventosFalso, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

describe('PayInvoice (Use Case)', () => {
  async function montarCenario() {
    const faturas = new InMemoryRepositorioFatura();
    const geradorDeIds = new GeradorDeIdsSequencial('inv');
    const eventos = new PublicadorDeEventosFalso();
    const emitirFatura = new CreateInvoice(faturas, geradorDeIds);

    const fatura = await emitirFatura.executar({
      studentId: 'std-1',
      description: 'Mensalidade Junho/2026',
      amountInCents: 12000,
      dueDate: '2026-06-10T00:00:00Z',
    });

    const casoDeUso = new PayInvoice(
      faturas,
      new StandardLateFee(),
      eventos,
      new RelogioFixo(new Date('2026-06-10T00:00:00Z')),
    );

    return { casoDeUso, faturas, eventos, faturaId: fatura.id };
  }

  it('paga em dia: sem multa e publica FaturaPaga', async () => {
    const { casoDeUso, eventos, faturaId } = await montarCenario();

    const recibo = await casoDeUso.executar({ invoiceId: faturaId, paidAt: '2026-06-09T00:00:00Z' });

    expect(recibo.daysOverdue).toBe(0);
    expect(recibo.totalInCents).toBe(12000);
    expect(recibo.status).toBe('PAID');
    expect(eventos.publicados[0]).toBeInstanceOf(FaturaPaga);
  });

  it('paga com 10 dias de atraso: aplica multa+juros', async () => {
    const { casoDeUso, faturaId } = await montarCenario();

    const recibo = await casoDeUso.executar({ invoiceId: faturaId, paidAt: '2026-06-20T00:00:00Z' });

    // 120,00 -> multa 2,40 (240c) + juros 0,333%*10 -> 0,40 (40c) = 12000+280 = 12280
    expect(recibo.daysOverdue).toBe(10);
    expect(recibo.totalInCents).toBe(12280);
  });

  it('rejeita fatura inexistente', async () => {
    const { casoDeUso } = await montarCenario();
    await expect(casoDeUso.executar({ invoiceId: 'nope' })).rejects.toThrow(DomainError);
  });

  it('impede pagar a mesma fatura duas vezes', async () => {
    const { casoDeUso, faturaId } = await montarCenario();
    await casoDeUso.executar({ invoiceId: faturaId, paidAt: '2026-06-09T00:00:00Z' });
    await expect(
      casoDeUso.executar({ invoiceId: faturaId, paidAt: '2026-06-09T00:00:00Z' }),
    ).rejects.toThrow(DomainError);
  });
});
