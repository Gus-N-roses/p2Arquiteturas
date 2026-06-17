import assert from 'node:assert';
import { Before, Given, Then, When } from '@cucumber/cucumber';
import { CreateInvoice } from '../../../codigo/aplicacao/casos-de-uso/EmitirFatura';
import { PayInvoice, PaymentReceipt } from '../../../codigo/aplicacao/casos-de-uso/PagarFatura';
import { StandardLateFee } from '../../../codigo/dominio/precificacao/EstrategiaMultaAtraso';
import { InMemoryRepositorioFatura } from '../../../codigo/infraestrutura/repositorios/RepositorioFaturaEmMemoria';
import { PublicadorDeEventosFalso, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

interface Mundo {
  faturas: InMemoryRepositorioFatura;
  emitirFatura: CreateInvoice;
  pagarFatura: PayInvoice;
  faturaId: string;
  recibo?: PaymentReceipt;
}

let mundo: Mundo;

Before(() => {
  const faturas = new InMemoryRepositorioFatura();
  mundo = {
    faturas,
    emitirFatura: new CreateInvoice(faturas, new GeradorDeIdsSequencial('inv')),
    pagarFatura: new PayInvoice(
      faturas,
      new StandardLateFee(),
      new PublicadorDeEventosFalso(),
      new RelogioFixo(new Date('2026-06-10T00:00:00Z')),
    ),
    faturaId: '',
  };
});

Given('uma fatura de {int} reais com vencimento em {string}', async (reais: number, vencimento: string) => {
  const fatura = await mundo.emitirFatura.executar({
    studentId: 'std-1',
    description: 'Mensalidade',
    amountInCents: reais * 100,
    dueDate: `${vencimento}T00:00:00Z`,
  });
  mundo.faturaId = fatura.id;
});

When('o aluno paga a fatura em {string}', async (dataPagamento: string) => {
  mundo.recibo = await mundo.pagarFatura.executar({
    invoiceId: mundo.faturaId,
    paidAt: `${dataPagamento}T00:00:00Z`,
  });
});

Then('o total pago em centavos deve ser {int}', (centavos: number) => {
  assert.strictEqual(mundo.recibo?.totalInCents, centavos);
});

Then('a fatura deve ficar com status {string}', (status: string) => {
  assert.strictEqual(mundo.recibo?.status, status);
});
