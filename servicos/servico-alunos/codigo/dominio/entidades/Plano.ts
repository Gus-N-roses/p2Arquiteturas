import { Money } from '../objetos-de-valor/Dinheiro';
import { Periodicity } from './Periodicidade';

/**
 * Plano comercializado pela academia (ex.: "Musculação Mensal").
 * `monthlyPrice` é o preço de referência por mês; o valor final da matrícula
 * depende da periodicidade e é calculado por uma estratégia de precificação,
 * mantendo a entidade livre dessa regra (Single Responsibility).
 */
export class Plan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly monthlyPrice: Money,
    public readonly periodicity: Periodicity,
  ) {}
}
