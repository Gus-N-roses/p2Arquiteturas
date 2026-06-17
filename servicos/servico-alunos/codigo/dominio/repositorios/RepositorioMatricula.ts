import { Enrollment } from '../entidades/Matricula';

export interface RepositorioMatricula {
  save(enrollment: Enrollment): Promise<void>;
  findById(id: string): Promise<Enrollment | null>;
  findActiveByStudentId(studentId: string): Promise<Enrollment | null>;
  listByStudentId(studentId: string): Promise<Enrollment[]>;
}
