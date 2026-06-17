import { DecoradorLogCasoDeUso } from '../aplicacao/decoradores/DecoradorLogCasoDeUso';
import { CasoDeUso } from '../aplicacao/portas/CasoDeUso';
import {
  CheckActiveMembership,
  CheckActiveMembershipInput,
  CheckActiveMembershipOutput,
} from '../aplicacao/casos-de-uso/ConsultarMatriculaAtiva';
import {
  EnrollStudent,
  EnrollStudentInput,
  EnrollStudentOutput,
} from '../aplicacao/casos-de-uso/MatricularAluno';
import { ListPlans, PlanView } from '../aplicacao/casos-de-uso/ListarPlanos';
import { ListStudents, StudentView } from '../aplicacao/casos-de-uso/ListarAlunos';
import {
  RegisterStudent,
  RegisterStudentInput,
  RegisterStudentOutput,
} from '../aplicacao/casos-de-uso/CadastrarAluno';
import { ResolvedorEstrategiaPreco } from '../dominio/precificacao/ResolvedorEstrategiaPreco';
import { AlunoMatriculado } from '../dominio/eventos/AlunoMatriculado';
import { BarramentoEventosEmMemoria } from '../infraestrutura/eventos/BarramentoEventosEmMemoria';
import { ManipuladorEnviarEmailBoasVindas } from '../infraestrutura/eventos/manipuladores/ManipuladorEnviarEmailBoasVindas';
import { GeradorUuid } from '../infraestrutura/identificadores/GeradorUuid';
import { RegistradorConsole } from '../infraestrutura/logs/RegistradorConsole';
import { RelogioSistema } from '../infraestrutura/tempo/RelogioSistema';
import { InMemoryRepositorioMatricula } from '../infraestrutura/repositorios/RepositorioMatriculaEmMemoria';
import { InMemoryRepositorioPlano } from '../infraestrutura/repositorios/RepositorioPlanoEmMemoria';
import { InMemoryRepositorioAluno } from '../infraestrutura/repositorios/RepositorioAlunoEmMemoria';
import { defaultPlans } from '../infraestrutura/sementes/planosPadrao';

/**
 * COMPOSITION ROOT (Factory + Singleton).
 *
 * Único lugar do serviço que conhece as classes concretas e as monta. As
 * camadas internas só conhecem abstrações; é aqui que a injeção de dependência
 * acontece. Trocar in-memory por Postgres, ou o barramento por RabbitMQ, é
 * mudança localizada neste arquivo (Dependency Inversion na prática).
 */
export class Container {
  private static instance: Container | null = null;

  readonly cadastrarAluno: CasoDeUso<RegisterStudentInput, RegisterStudentOutput>;
  readonly matricularAluno: CasoDeUso<EnrollStudentInput, EnrollStudentOutput>;
  readonly listarAlunos: CasoDeUso<void, StudentView[]>;
  readonly listarPlanos: CasoDeUso<void, PlanView[]>;
  readonly consultarMatriculaAtiva: CasoDeUso<
    CheckActiveMembershipInput,
    CheckActiveMembershipOutput
  >;

  private constructor() {
    // --- Adapters de infraestrutura (singletons) ---
    const registrador = new RegistradorConsole();
    const geradorDeIds = new GeradorUuid();
    const relogio = new RelogioSistema();
    const precificacao = new ResolvedorEstrategiaPreco();

    const alunos = new InMemoryRepositorioAluno();
    const planos = new InMemoryRepositorioPlano(defaultPlans());
    const matriculas = new InMemoryRepositorioMatricula();

    // --- Barramento de eventos + observadores ---
    const barramentoDeEventos = new BarramentoEventosEmMemoria(registrador);
    barramentoDeEventos.assinar(
      new AlunoMatriculado('', '', '', 0).name,
      new ManipuladorEnviarEmailBoasVindas(registrador),
    );

    // --- Casos de uso, embrulhados pelo Decorator de logging ---
    this.cadastrarAluno = new DecoradorLogCasoDeUso(
      'RegisterStudent',
      new RegisterStudent(alunos, geradorDeIds),
      registrador,
    );
    this.matricularAluno = new DecoradorLogCasoDeUso(
      'EnrollStudent',
      new EnrollStudent(
        alunos,
        planos,
        matriculas,
        precificacao,
        barramentoDeEventos,
        geradorDeIds,
        relogio,
      ),
      registrador,
    );
    this.listarAlunos = new DecoradorLogCasoDeUso(
      'ListStudents',
      new ListStudents(alunos),
      registrador,
    );
    this.listarPlanos = new DecoradorLogCasoDeUso('ListPlans', new ListPlans(planos), registrador);
    this.consultarMatriculaAtiva = new DecoradorLogCasoDeUso(
      'CheckActiveMembership',
      new CheckActiveMembership(matriculas, relogio),
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
