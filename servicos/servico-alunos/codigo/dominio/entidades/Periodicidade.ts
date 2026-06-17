/**
 * Periodicidade de um plano da academia. Cada valor terá uma estratégia de
 * precificação correspondente (ver EstrategiaPrecoMatricula).
 */
export enum Periodicity {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

export function isPeriodicity(value: string): value is Periodicity {
  return (Object.values(Periodicity) as string[]).includes(value);
}
