import { RepositorioMatricula } from '../../dominio/repositorios/RepositorioMatricula';
import { Relogio } from '../portas/Relogio';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface CheckActiveMembershipInput {
  studentId: string;
}

export interface CheckActiveMembershipOutput {
  studentId: string;
  active: boolean;
  enrollmentId: string | null;
  planId: string | null;
  endsOn: string | null;
}

/**
 * Responde "este aluno pode treinar hoje?". É a consulta que o serviço de
 * controle de acesso faz antes de liberar a catraca. A regra de vigência vive
 * na entidade Enrollment (isValidOn); aqui apenas orquestramos.
 */
export class CheckActiveMembership
  implements CasoDeUso<CheckActiveMembershipInput, CheckActiveMembershipOutput>
{
  constructor(
    private readonly matriculas: RepositorioMatricula,
    private readonly relogio: Relogio,
  ) {}

  async executar(entrada: CheckActiveMembershipInput): Promise<CheckActiveMembershipOutput> {
    const matricula = await this.matriculas.findActiveByStudentId(entrada.studentId);
    const ativa = matricula?.isValidOn(this.relogio.agora()) ?? false;

    return {
      studentId: entrada.studentId,
      active: ativa,
      enrollmentId: ativa ? matricula!.id : null,
      planId: ativa ? matricula!.planId : null,
      endsOn: ativa ? matricula!.endsOn.toISOString() : null,
    };
  }
}
