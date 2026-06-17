import { CheckIn } from '../entidades/Entrada';

export interface RepositorioEntrada {
  save(checkIn: CheckIn): Promise<void>;
  list(): Promise<CheckIn[]>;
  listByStudentId(studentId: string): Promise<CheckIn[]>;
}
