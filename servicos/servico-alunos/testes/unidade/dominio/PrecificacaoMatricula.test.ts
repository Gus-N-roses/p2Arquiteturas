import { Periodicity } from '../../../codigo/dominio/entidades/Periodicidade';
import {
  AnnualPricing,
  MonthlyPricing,
  QuarterlyPricing,
} from '../../../codigo/dominio/precificacao/EstrategiaPrecoMatricula';
import { ResolvedorEstrategiaPreco } from '../../../codigo/dominio/precificacao/ResolvedorEstrategiaPreco';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';

describe('Estratégias de precificação (Strategy)', () => {
  const monthly = Money.fromReais(120);

  it('mensal: sem desconto', () => {
    expect(new MonthlyPricing().priceFor(monthly).amountInCents).toBe(12000);
  });

  it('trimestral: 3 meses com 5% de desconto', () => {
    // 120 * 3 = 360 -> 5% off = 342,00
    expect(new QuarterlyPricing().priceFor(monthly).amountInCents).toBe(34200);
  });

  it('anual: 12 meses com 15% de desconto', () => {
    // 120 * 12 = 1440 -> 15% off = 1224,00
    expect(new AnnualPricing().priceFor(monthly).amountInCents).toBe(122400);
  });
});

describe('ResolvedorEstrategiaPreco (Factory)', () => {
  const resolver = new ResolvedorEstrategiaPreco();

  it('resolve a estratégia correta para cada periodicidade', () => {
    expect(resolver.resolve(Periodicity.MONTHLY)).toBeInstanceOf(MonthlyPricing);
    expect(resolver.resolve(Periodicity.QUARTERLY)).toBeInstanceOf(QuarterlyPricing);
    expect(resolver.resolve(Periodicity.ANNUAL)).toBeInstanceOf(AnnualPricing);
  });

  it('lança DomainError para periodicidade sem estratégia', () => {
    expect(() => resolver.resolve('WEEKLY' as Periodicity)).toThrow(DomainError);
  });
});
