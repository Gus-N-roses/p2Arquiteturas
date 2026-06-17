import { EventoDeDominio } from '../../dominio/eventos/EventoDeDominio';
import { ManipuladorDeEvento, PublicadorDeEventos } from '../../aplicacao/portas/PublicadorDeEventos';
import { Registrador } from '../../aplicacao/portas/Registrador';

/**
 * OBSERVER PATTERN (o "subject"/publisher concreto).
 *
 * Mantém uma lista de observadores por tipo de evento. Quem publica não sabe
 * quem está ouvindo nem quantos são. Registrar um novo observador não altera
 * o publicador — apenas `subscribe`. Aqui é um barramento em processo; a mesma
 * interface poderia apontar para RabbitMQ/Kafka sem mudar os casos de uso.
 */
export class BarramentoEventosEmMemoria implements PublicadorDeEventos {
  private readonly manipuladores = new Map<string, ManipuladorDeEvento[]>();

  constructor(private readonly registrador: Registrador) {}

  assinar(nomeDoEvento: string, manipulador: ManipuladorDeEvento): void {
    const current = this.manipuladores.get(nomeDoEvento) ?? [];
    current.push(manipulador);
    this.manipuladores.set(nomeDoEvento, current);
  }

  async publicar(evento: EventoDeDominio): Promise<void> {
    const manipuladores = this.manipuladores.get(evento.name) ?? [];
    await Promise.all(
      manipuladores.map((manipulador) =>
        manipulador.manipular(evento).catch((error: Error) => {
          // Falha de um observador não derruba a operação principal.
          this.registrador.erro(`Observador de ${evento.name} falhou`, { reason: error.message });
        }),
      ),
    );
  }
}
