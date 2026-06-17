import { EventoDeDominio } from './EventoDeDominio';

/**
 * Disparado quando uma matrícula é aberta. Outros interessados (ex.: gerar a
 * primeira fatura no serviço financeiro, enviar e-mail de boas-vindas) reagem
 * a ele sem que o caso de uso de matrícula os conheça — base do Observer.
 */
export class AlunoMatriculado implements EventoDeDominio {
  readonly name = 'AlunoMatriculado';
  readonly occurredOn: Date;

  constructor(
    public readonly enrollmentId: string,
    public readonly studentId: string,
    public readonly planId: string,
    public readonly priceInCents: number,
    occurredOn: Date = new Date(),
  ) {
    this.occurredOn = occurredOn;
  }
}
