import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';

describe('Money (Value Object)', () => {
  it('cria a partir de reais convertendo para centavos', () => {
    expect(Money.fromReais(120).amountInCents).toBe(12000);
  });

  it('multiplica preservando centavos inteiros', () => {
    expect(Money.fromReais(120).multiply(3).amountInCents).toBe(36000);
  });

  it('aplica desconto percentual', () => {
    expect(Money.fromReais(100).applyDiscountPercent(15).amountInCents).toBe(8500);
  });

  it('formata em moeda brasileira', () => {
    expect(Money.fromReais(1234.5).format()).toContain('1.234,50');
  });

  it('rejeita valores negativos', () => {
    expect(() => Money.fromCents(-1)).toThrow(DomainError);
  });

  it('rejeita percentual de desconto fora de 0..100', () => {
    expect(() => Money.fromReais(10).applyDiscountPercent(150)).toThrow(DomainError);
  });
});
