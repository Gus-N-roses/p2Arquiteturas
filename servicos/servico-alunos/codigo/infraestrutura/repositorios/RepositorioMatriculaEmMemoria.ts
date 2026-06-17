import { Enrollment, EnrollmentStatus } from '../../dominio/entidades/Matricula';
import { RepositorioMatricula } from '../../dominio/repositorios/RepositorioMatricula';

export class InMemoryRepositorioMatricula implements RepositorioMatricula {
  private readonly byId = new Map<string, Enrollment>();

  async save(enrollment: Enrollment): Promise<void> {
    this.byId.set(enrollment.id, enrollment);
  }

  async findById(id: string): Promise<Enrollment | null> {
    return this.byId.get(id) ?? null;
  }

  async findActiveByStudentId(studentId: string): Promise<Enrollment | null> {
    for (const enrollment of this.byId.values()) {
      if (enrollment.studentId === studentId && enrollment.status === EnrollmentStatus.ACTIVE) {
        return enrollment;
      }
    }
    return null;
  }

  async listByStudentId(studentId: string): Promise<Enrollment[]> {
    return [...this.byId.values()].filter((e) => e.studentId === studentId);
  }
}
