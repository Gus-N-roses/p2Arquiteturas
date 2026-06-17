import { EventoDeDominio } from './EventoDeDominio';

/**
 * Disparado quando uma fatura é quitada. Observadores reagem (emitir recibo,
 * notificar o controle de acesso de que o aluno está em dia, etc.).
 */
export class FaturaPaga implements EventoDeDominio {
  readonly name = 'FaturaPaga';
  readonly occurredOn: Date;

  constructor(
    public readonly invoiceId: string,
    public readonly studentId: string,
    public readonly amountPaidInCents: number,
    occurredOn: Date = new Date(),
  ) {
    this.occurredOn = occurredOn;
  }
}
