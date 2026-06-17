/**
 * Contrato base de um evento de domínio. Eventos descrevem algo que já
 * aconteceu (nome no passado) e carregam dados imutáveis.
 */
export interface EventoDeDominio {
  readonly name: string;
  readonly occurredOn: Date;
}
