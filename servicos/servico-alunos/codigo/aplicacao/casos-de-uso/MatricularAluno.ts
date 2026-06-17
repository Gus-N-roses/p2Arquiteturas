import { Enrollment } from '../../dominio/entidades/Matricula';
import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { AlunoMatriculado } from '../../dominio/eventos/AlunoMatriculado';
import { ResolvedorEstrategiaPreco } from '../../dominio/precificacao/ResolvedorEstrategiaPreco';
import { RepositorioMatricula } from '../../dominio/repositorios/RepositorioMatricula';
import { RepositorioPlano } from '../../dominio/repositorios/RepositorioPlano';
import { RepositorioAluno } from '../../dominio/repositorios/RepositorioAluno';
import { Relogio } from '../portas/Relogio';
import { PublicadorDeEventos } from '../portas/PublicadorDeEventos';
import { GeradorDeIds } from '../portas/GeradorDeIds';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface EnrollStudentInput {
  studentId: string;
  planId: string;
}

export interface EnrollStudentOutput {
  enrollmentId: string;
  studentId: string;
  planId: string;
  price: string;
  priceInCents: number;
  startsOn: string;
  endsOn: string;
}

/**
 * Caso de uso: matricular um aluno em um plano.
 *
 * Orquestra o domínio: valida aluno e plano, calcula o preço via Strategy
 * (resolvida pela Factory), abre a matrícula e publica um evento de domínio
 * (Observer) para que outros contextos reajam — sem acoplamento direto.
 */
export class EnrollStudent implements CasoDeUso<EnrollStudentInput, EnrollStudentOutput> {
  constructor(
    private readonly alunos: RepositorioAluno,
    private readonly planos: RepositorioPlano,
    private readonly matriculas: RepositorioMatricula,
    private readonly precificacao: ResolvedorEstrategiaPreco,
    private readonly eventos: PublicadorDeEventos,
    private readonly geradorDeIds: GeradorDeIds,
    private readonly relogio: Relogio,
  ) {}

  async executar(entrada: EnrollStudentInput): Promise<EnrollStudentOutput> {
    const aluno = await this.alunos.findById(entrada.studentId);
    if (!aluno) {
      throw new DomainError(`Aluno ${entrada.studentId} não encontrado`);
    }
    if (!aluno.isActive()) {
      throw new DomainError('Aluno inativo não pode ser matriculado');
    }

    const plano = await this.planos.findById(entrada.planId);
    if (!plano) {
      throw new DomainError(`Plano ${entrada.planId} não encontrado`);
    }

    const matriculaAtiva = await this.matriculas.findActiveByStudentId(aluno.id);
    if (matriculaAtiva) {
      throw new DomainError('Aluno já possui uma matrícula ativa');
    }

    const preco = this.precificacao.resolve(plano.periodicity).priceFor(plano.monthlyPrice);

    const matricula = Enrollment.open({
      id: this.geradorDeIds.gerar(),
      studentId: aluno.id,
      planId: plano.id,
      price: preco,
      periodicity: plano.periodicity,
      startsOn: this.relogio.agora(),
    });

    await this.matriculas.save(matricula);

    await this.eventos.publicar(
      new AlunoMatriculado(
        matricula.id,
        aluno.id,
        plano.id,
        preco.amountInCents,
        matricula.startsOn,
      ),
    );

    return {
      enrollmentId: matricula.id,
      studentId: matricula.studentId,
      planId: matricula.planId,
      price: preco.format(),
      priceInCents: preco.amountInCents,
      startsOn: matricula.startsOn.toISOString(),
      endsOn: matricula.endsOn.toISOString(),
    };
  }
}
