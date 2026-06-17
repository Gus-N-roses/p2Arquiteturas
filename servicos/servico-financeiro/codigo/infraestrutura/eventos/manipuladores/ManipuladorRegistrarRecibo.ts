import { ManipuladorDeEvento } from '../../../aplicacao/portas/PublicadorDeEventos';
import { Registrador } from '../../../aplicacao/portas/Registrador';
import { FaturaPaga } from '../../../dominio/eventos/FaturaPaga';

/**
 * Observador concreto: registra o recibo quando uma fatura é paga. Em produção
 * poderia notificar o serviço de acesso ou um sistema fiscal — sem que o caso
 * de uso PayInvoice precise conhecê-lo.
 */
export class ManipuladorRegistrarRecibo implements ManipuladorDeEvento<FaturaPaga> {
  constructor(private readonly registrador: Registrador) {}

  async manipular(evento: FaturaPaga): Promise<void> {
    this.registrador.informar('🧾 Recibo registrado para pagamento de fatura', {
      invoiceId: evento.invoiceId,
      studentId: evento.studentId,
      amountPaidInCents: evento.amountPaidInCents,
    });
  }
}
