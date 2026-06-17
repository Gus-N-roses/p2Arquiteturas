import { ManipuladorDeEvento } from '../../../aplicacao/portas/PublicadorDeEventos';
import { Registrador } from '../../../aplicacao/portas/Registrador';
import { AlunoMatriculado } from '../../../dominio/eventos/AlunoMatriculado';

/**
 * Observador concreto: reage à matrícula enviando boas-vindas. Aqui apenas
 * registra em log (simulação), mas a porta poderia ser um serviço de e-mail.
 * O caso de uso EnrollStudent não conhece esta classe — só publica o evento.
 */
export class ManipuladorEnviarEmailBoasVindas implements ManipuladorDeEvento<AlunoMatriculado> {
  constructor(private readonly registrador: Registrador) {}

  async manipular(evento: AlunoMatriculado): Promise<void> {
    this.registrador.informar('📧 Enviando e-mail de boas-vindas ao aluno', {
      studentId: evento.studentId,
      enrollmentId: evento.enrollmentId,
    });
  }
}
