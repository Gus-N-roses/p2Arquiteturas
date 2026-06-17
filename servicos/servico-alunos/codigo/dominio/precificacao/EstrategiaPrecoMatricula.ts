import { Money } from '../objetos-de-valor/Dinheiro';
import { Periodicity } from '../entidades/Periodicidade';

/**
 * STRATEGY PATTERN
 *
 * Cada periodicidade de plano tem uma política de preço diferente (descontos
 * por fidelidade). Em vez de um `switch` gigante dentro do caso de uso, cada
 * política é uma classe que implementa este contrato. Adicionar uma nova
 * periodicidade = adicionar uma nova Strategy, sem tocar no código existente
 * (Open/Closed Principle).
 */
export interface EstrategiaPrecoMatricula {
  readonly periodicity: Periodicity;
  /** Calcula o preço total da matrícula a partir do preço mensal do plano. */
  priceFor(monthlyPrice: Money): Money;
}

/** Plano mensal: preço cheio, sem desconto. */
export class MonthlyPricing implements EstrategiaPrecoMatricula {
  readonly periodicity = Periodicity.MONTHLY;

  priceFor(monthlyPrice: Money): Money {
    return monthlyPrice.multiply(1);
  }
}

/** Plano trimestral: 3 meses com 5% de desconto. */
export class QuarterlyPricing implements EstrategiaPrecoMatricula {
  readonly periodicity = Periodicity.QUARTERLY;
  private static readonly MONTHS = 3;
  private static readonly DISCOUNT_PERCENT = 5;

  priceFor(monthlyPrice: Money): Money {
    return monthlyPrice
      .multiply(QuarterlyPricing.MONTHS)
      .applyDiscountPercent(QuarterlyPricing.DISCOUNT_PERCENT);
  }
}

/** Plano anual: 12 meses com 15% de desconto. */
export class AnnualPricing implements EstrategiaPrecoMatricula {
  readonly periodicity = Periodicity.ANNUAL;
  private static readonly MONTHS = 12;
  private static readonly DISCOUNT_PERCENT = 15;

  priceFor(monthlyPrice: Money): Money {
    return monthlyPrice
      .multiply(AnnualPricing.MONTHS)
      .applyDiscountPercent(AnnualPricing.DISCOUNT_PERCENT);
  }
}
