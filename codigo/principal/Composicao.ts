import { DecoradorLogCasoDeUso } from '../aplicacao/decoradores/DecoradorLogCasoDeUso';
import { CasoDeUso } from '../aplicacao/portas/CasoDeUso';
import {
  ListCheckIns,
  ListStudentCheckIns,
  ListStudentCheckInsInput,
} from '../aplicacao/casos-de-uso/ListarEntradas';
import {
  CheckInView,
  RegisterCheckIn,
  RegisterCheckInInput,
} from '../aplicacao/casos-de-uso/RegistrarEntrada';
import { ConsultaHttpMatricula } from '../infraestrutura/integracoes/ConsultaHttpMatricula';
import { GeradorUuid } from '../infraestrutura/identificadores/GeradorUuid';
import { RegistradorConsole } from '../infraestrutura/logs/RegistradorConsole';
import { InMemoryRepositorioEntrada } from '../infraestrutura/repositorios/RepositorioEntradaEmMemoria';
import { RelogioSistema } from '../infraestrutura/tempo/RelogioSistema';

/**
 * COMPOSITION ROOT (Factory + Singleton). A URL do servico-alunos vem de
 * variável de ambiente — a mesma imagem roda em qualquer cenário (docker-compose,
 * nuvem) só mudando a configuração (12-Factor App).
 */
export class Container {
  private static instance: Container | null = null;

  readonly registrarEntrada: CasoDeUso<RegisterCheckInInput, CheckInView>;
  readonly listarEntradas: CasoDeUso<void, CheckInView[]>;
  readonly listarEntradasDoAluno: CasoDeUso<ListStudentCheckInsInput, CheckInView[]>;

  private constructor() {
    const registrador = new RegistradorConsole();
    const geradorDeIds = new GeradorUuid();
    const relogio = new RelogioSistema();
    const entradas = new InMemoryRepositorioEntrada();

    const urlServicoAlunos = process.env.URL_SERVICO_ALUNOS ?? 'http://localhost:3001';
    const matriculas = new ConsultaHttpMatricula(urlServicoAlunos, registrador);

    this.registrarEntrada = new DecoradorLogCasoDeUso(
      'RegisterCheckIn',
      new RegisterCheckIn(matriculas, entradas, geradorDeIds, relogio),
      registrador,
    );
    this.listarEntradas = new DecoradorLogCasoDeUso(
      'ListCheckIns',
      new ListCheckIns(entradas),
      registrador,
    );
    this.listarEntradasDoAluno = new DecoradorLogCasoDeUso(
      'ListStudentCheckIns',
      new ListStudentCheckIns(entradas),
      registrador,
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}
