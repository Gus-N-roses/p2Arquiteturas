import { Relogio } from '../../codigo/aplicacao/portas/Relogio';
import { PublicadorDeEventos } from '../../codigo/aplicacao/portas/PublicadorDeEventos';
import { GeradorDeIds } from '../../codigo/aplicacao/portas/GeradorDeIds';
import { Registrador } from '../../codigo/aplicacao/portas/Registrador';
import { EventoDeDominio } from '../../codigo/dominio/eventos/EventoDeDominio';

/** Gera ids previsíveis (id-1, id-2, ...) para asserções determinísticas. */
export class GeradorDeIdsSequencial implements GeradorDeIds {
  private counter = 0;
  constructor(private readonly prefix = 'id') {}
  gerar(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

/** Relógio congelado: o "agora" é controlado pelo teste. */
export class RelogioFixo implements Relogio {
  constructor(private current: Date) {}
  agora(): Date {
    return this.current;
  }
  set(date: Date): void {
    this.current = date;
  }
}

/** Captura os eventos publicados para inspeção nos testes (spy). */
export class PublicadorDeEventosFalso implements PublicadorDeEventos {
  readonly publicados: EventoDeDominio[] = [];
  async publicar(evento: EventoDeDominio): Promise<void> {
    this.publicados.push(evento);
  }
}

/** Registrador silencioso para não poluir a saída dos testes. */
export class RegistradorNulo implements Registrador {
  informar(): void {}
  erro(): void {}
}
