import { EventoDeDominio } from '../../dominio/eventos/EventoDeDominio';

/**
 * Porta de publicação de eventos de domínio. A implementação concreta
 * (em memória, RabbitMQ, Kafka...) fica na infraestrutura.
 */
export interface PublicadorDeEventos {
  publicar(evento: EventoDeDominio): Promise<void>;
}

/**
 * OBSERVER PATTERN — contrato do observador. Cada manipulador reage a um tipo de
 * evento. Novos observadores são registrados sem alterar quem publica.
 */
export interface ManipuladorDeEvento<T extends EventoDeDominio = EventoDeDominio> {
  manipular(evento: T): Promise<void>;
}
