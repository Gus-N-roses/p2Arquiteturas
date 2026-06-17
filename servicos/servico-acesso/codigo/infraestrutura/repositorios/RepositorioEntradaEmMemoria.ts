import { CheckIn } from '../../dominio/entidades/Entrada';
import { RepositorioEntrada } from '../../dominio/repositorios/RepositorioEntrada';

export class InMemoryRepositorioEntrada implements RepositorioEntrada {
  private readonly items: CheckIn[] = [];

  async save(checkIn: CheckIn): Promise<void> {
    this.items.push(checkIn);
  }

  async list(): Promise<CheckIn[]> {
    return [...this.items];
  }

  async listByStudentId(studentId: string): Promise<CheckIn[]> {
    return this.items.filter((checkIn) => checkIn.studentId === studentId);
  }
}
