import { RepositorioPlano } from '../../dominio/repositorios/RepositorioPlano';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface PlanView {
  id: string;
  name: string;
  monthlyPrice: string;
  monthlyPriceInCents: number;
  periodicity: string;
}

export class ListPlans implements CasoDeUso<void, PlanView[]> {
  constructor(private readonly planos: RepositorioPlano) {}

  async executar(): Promise<PlanView[]> {
    const planos = await this.planos.list();
    return planos.map((plano) => ({
      id: plano.id,
      name: plano.name,
      monthlyPrice: plano.monthlyPrice.format(),
      monthlyPriceInCents: plano.monthlyPrice.amountInCents,
      periodicity: plano.periodicity,
    }));
  }
}
