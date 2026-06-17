import { EventoDeDominio } from '../../dominio/eventos/EventoDeDominio';

export interface PublicadorDeEventos {
  publicar(evento: EventoDeDominio): Promise<void>;
}

export interface ManipuladorDeEvento<T extends EventoDeDominio = EventoDeDominio> {
  manipular(evento: T): Promise<void>;
}
