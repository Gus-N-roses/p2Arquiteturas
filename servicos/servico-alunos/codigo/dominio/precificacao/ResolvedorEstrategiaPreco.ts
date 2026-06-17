import { DomainError } from '../erros/ErroDeDominio';
import { Periodicity } from '../entidades/Periodicidade';
import {
  AnnualPricing,
  EstrategiaPrecoMatricula,
  MonthlyPricing,
  QuarterlyPricing,
} from './EstrategiaPrecoMatricula';

/**
 * FACTORY PATTERN
 *
 * Encapsula a escolha da Strategy de precificação correta para cada
 * periodicidade. O caso de uso pede "a estratégia para ANNUAL" sem conhecer as
 * classes concretas — depende só da abstração (Dependency Inversion).
 */
export class ResolvedorEstrategiaPreco {
  private readonly strategies: Map<Periodicity, EstrategiaPrecoMatricula>;

  constructor(strategies: EstrategiaPrecoMatricula[] = ResolvedorEstrategiaPreco.defaults()) {
    this.strategies = new Map(strategies.map((s) => [s.periodicity, s]));
  }

  private static defaults(): EstrategiaPrecoMatricula[] {
    return [new MonthlyPricing(), new QuarterlyPricing(), new AnnualPricing()];
  }

  resolve(periodicity: Periodicity): EstrategiaPrecoMatricula {
    const strategy = this.strategies.get(periodicity);
    if (!strategy) {
      throw new DomainError(`Nenhuma estratégia de preço para a periodicidade ${periodicity}`);
    }
    return strategy;
  }
}
