import { Money } from '../objetos-de-valor/Dinheiro';

/**
 * STRATEGY PATTERN
 *
 * Política de multa/juros por atraso. A academia pode oferecer condições
 * diferentes (sem multa em campanhas promocionais, multa padrão, etc.). Cada
 * política é uma Strategy; o caso de uso de pagamento não conhece a fórmula,
 * apenas pede o acréscimo à estratégia injetada (Open/Closed + DIP).
 */
export interface EstrategiaMultaAtraso {
  readonly name: string;
  /** Acréscimo devido sobre `amount` dado o número de dias em atraso. */
  surcharge(amount: Money, daysOverdue: number): Money;
}

/** Sem multa: usada em promoções/cortesias. */
export class NoLateFee implements EstrategiaMultaAtraso {
  readonly name = 'NONE';
  surcharge(_amount: Money, _daysOverdue: number): Money {
    return Money.zero();
  }
}

/**
 * Multa padrão: 2% fixos + 0,033% ao dia (≈ 1% ao mês) de juros simples,
 * regra comum de cobrança no Brasil.
 */
export class StandardLateFee implements EstrategiaMultaAtraso {
  readonly name = 'STANDARD';
  private static readonly FINE_PERCENT = 2;
  private static readonly DAILY_INTEREST_PERCENT = 0.0333;

  surcharge(amount: Money, daysOverdue: number): Money {
    if (daysOverdue <= 0) {
      return Money.zero();
    }
    const fine = amount.percentage(StandardLateFee.FINE_PERCENT);
    const interest = amount.percentage(StandardLateFee.DAILY_INTEREST_PERCENT * daysOverdue);
    return fine.add(interest);
  }
}
