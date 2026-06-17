import { DomainError } from '../erros/ErroDeDominio';

/**
 * Dinheiro em centavos (inteiro), evitando erros de ponto flutuante. Toda a
 * aritmética financeira do serviço de cobrança passa por aqui.
 */
export class Money {
  private constructor(private readonly cents: number) {}

  static fromCents(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) {
      throw new DomainError(`Valor monetário inválido: ${cents} centavos`);
    }
    return new Money(cents);
  }

  static fromReais(reais: number): Money {
    return Money.fromCents(Math.round(reais * 100));
  }

  static zero(): Money {
    return new Money(0);
  }

  get amountInCents(): number {
    return this.cents;
  }

  add(other: Money): Money {
    return new Money(this.cents + other.cents);
  }

  percentage(percent: number): Money {
    return Money.fromCents(Math.round(this.cents * (percent / 100)));
  }

  toReais(): number {
    return this.cents / 100;
  }

  format(): string {
    return this.toReais().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
