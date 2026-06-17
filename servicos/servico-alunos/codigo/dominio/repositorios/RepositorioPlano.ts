import { Plan } from '../entidades/Plano';

export interface RepositorioPlano {
  findById(id: string): Promise<Plan | null>;
  list(): Promise<Plan[]>;
}
