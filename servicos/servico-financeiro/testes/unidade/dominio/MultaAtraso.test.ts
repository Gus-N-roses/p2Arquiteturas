import { NoLateFee, StandardLateFee } from '../../../codigo/dominio/precificacao/EstrategiaMultaAtraso';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';

describe('Estratégias de multa por atraso (Strategy)', () => {
  const amount = Money.fromReais(100);

  it('NoLateFee: nunca cobra acréscimo', () => {
    expect(new NoLateFee().surcharge(amount, 30).amountInCents).toBe(0);
  });

  it('StandardLateFee: sem atraso, sem acréscimo', () => {
    expect(new StandardLateFee().surcharge(amount, 0).amountInCents).toBe(0);
  });

  it('StandardLateFee: 10 dias de atraso = 2% multa + 0,333% de juros', () => {
    // 100,00 -> multa 2,00 (200c) + juros 0,333% -> 0,33 (33c) = 233c
    expect(new StandardLateFee().surcharge(amount, 10).amountInCents).toBe(233);
  });

  it('StandardLateFee: 30 dias de atraso ≈ 2% + 1%', () => {
    // multa 200c + juros 0,0333%*30=0,999% -> 100c = 300c
    expect(new StandardLateFee().surcharge(amount, 30).amountInCents).toBe(300);
  });
});
