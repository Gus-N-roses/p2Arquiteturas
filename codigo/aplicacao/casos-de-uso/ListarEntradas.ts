import { CheckIn } from '../../dominio/entidades/Entrada';
import { RepositorioEntrada } from '../../dominio/repositorios/RepositorioEntrada';
import { CasoDeUso } from '../portas/CasoDeUso';
import { CheckInView } from './RegistrarEntrada';

function toView(entrada: CheckIn): CheckInView {
  return {
    id: entrada.id,
    studentId: entrada.studentId,
    allowed: entrada.allowed,
    reason: entrada.reason,
    occurredAt: entrada.occurredAt.toISOString(),
  };
}

export class ListCheckIns implements CasoDeUso<void, CheckInView[]> {
  constructor(private readonly entradas: RepositorioEntrada) {}

  async executar(): Promise<CheckInView[]> {
    return (await this.entradas.list()).map(toView);
  }
}

export interface ListStudentCheckInsInput {
  studentId: string;
}

export class ListStudentCheckIns implements CasoDeUso<ListStudentCheckInsInput, CheckInView[]> {
  constructor(private readonly entradas: RepositorioEntrada) {}

  async executar(entrada: ListStudentCheckInsInput): Promise<CheckInView[]> {
    return (await this.entradas.listByStudentId(entrada.studentId)).map(toView);
  }
}
