import { Plan } from '../../dominio/entidades/Plano';
import { RepositorioPlano } from '../../dominio/repositorios/RepositorioPlano';

export class InMemoryRepositorioPlano implements RepositorioPlano {
  private readonly byId = new Map<string, Plan>();

  constructor(initialPlans: Plan[] = []) {
    initialPlans.forEach((plan) => this.add(plan));
  }

  /** Cadastra/atualiza um plano no catálogo (semeadura e administração). */
  add(plan: Plan): void {
    this.byId.set(plan.id, plan);
  }

  async findById(id: string): Promise<Plan | null> {
    return this.byId.get(id) ?? null;
  }

  async list(): Promise<Plan[]> {
    return [...this.byId.values()];
  }
}
