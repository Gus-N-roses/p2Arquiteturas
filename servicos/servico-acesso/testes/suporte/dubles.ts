import { Relogio } from '../../codigo/aplicacao/portas/Relogio';
import { GeradorDeIds } from '../../codigo/aplicacao/portas/GeradorDeIds';
import { Registrador } from '../../codigo/aplicacao/portas/Registrador';
import { ConsultaMatricula, StatusMatricula } from '../../codigo/dominio/integracoes/ConsultaMatricula';
import { UpstreamUnavailableError } from '../../codigo/dominio/erros/ErroServicoIndisponivel';

export class GeradorDeIdsSequencial implements GeradorDeIds {
  private counter = 0;
  constructor(private readonly prefix = 'id') {}
  gerar(): string {
    this.counter += 1;
    return `${this.prefix}-${this.counter}`;
  }
}

export class RelogioFixo implements Relogio {
  constructor(private current: Date) {}
  agora(): Date {
    return this.current;
  }
}

export class RegistradorNulo implements Registrador {
  informar(): void {}
  erro(): void {}
}

/**
 * Adapter falso para o servico-alunos: permite simular "aluno em dia",
 * "aluno sem matrícula" e "serviço fora do ar" sem nenhuma chamada de rede.
 */
export class ConsultaMatriculaFalsa implements ConsultaMatricula {
  private status: StatusMatricula;
  private unavailable = false;

  constructor(ativa: boolean) {
    this.status = { alunoId: 'std-1', ativa, planoId: ativa ? 'plan-annual' : null, terminaEm: null };
  }

  static indisponivel(): ConsultaMatriculaFalsa {
    const consulta = new ConsultaMatriculaFalsa(false);
    consulta.unavailable = true;
    return consulta;
  }

  async obterStatus(alunoId: string): Promise<StatusMatricula> {
    if (this.unavailable) {
      throw new UpstreamUnavailableError('servico-alunos indisponível');
    }
    return { ...this.status, alunoId };
  }
}
