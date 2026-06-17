import { DomainError } from '../erros/ErroDeDominio';

/**
 * Value Object de dinheiro em centavos (inteiro), evitando os erros de
 * arredondamento de ponto flutuante. Toda aritmética monetária do domínio
 * passa por aqui — não há `number` "solto" representando reais no código.
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

  get amountInCents(): number {
    return this.cents;
  }

  multiply(factor: number): Money {
    return Money.fromCents(Math.round(this.cents * factor));
  }

  applyDiscountPercent(percent: number): Money {
    if (percent < 0 || percent > 100) {
      throw new DomainError(`Percentual de desconto inválido: ${percent}`);
    }
    return this.multiply(1 - percent / 100);
  }

  toReais(): number {
    return this.cents / 100;
  }

  format(): string {
    return this.toReais().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }
}
