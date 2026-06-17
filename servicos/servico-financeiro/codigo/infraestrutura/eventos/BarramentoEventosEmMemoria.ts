import { EventoDeDominio } from '../../dominio/eventos/EventoDeDominio';
import { ManipuladorDeEvento, PublicadorDeEventos } from '../../aplicacao/portas/PublicadorDeEventos';
import { Registrador } from '../../aplicacao/portas/Registrador';

/**
 * OBSERVER PATTERN (publisher concreto). Barramento de eventos em processo;
 * registrar novos observadores não altera quem publica.
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
        manipulador.manipular(evento).catch((error: Error) =>
          this.registrador.erro(`Observador de ${evento.name} falhou`, { reason: error.message }),
        ),
      ),
    );
  }
}
