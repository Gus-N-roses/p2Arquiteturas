import { Enrollment } from '../../../codigo/dominio/entidades/Matricula';
import { Periodicity } from '../../../codigo/dominio/entidades/Periodicidade';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';

describe('Enrollment (Entity)', () => {
  const base = {
    id: 'enr-1',
    studentId: 'std-1',
    planId: 'plan-monthly',
    price: Money.fromReais(120),
    startsOn: new Date('2026-01-10T00:00:00Z'),
  };

  it('calcula a data de término conforme a periodicidade mensal', () => {
    const enrollment = Enrollment.open({ ...base, periodicity: Periodicity.MONTHLY });
    expect(enrollment.endsOn.toISOString()).toBe(new Date('2026-02-10T00:00:00Z').toISOString());
  });

  it('é válida dentro da vigência e inválida fora dela', () => {
    const enrollment = Enrollment.open({ ...base, periodicity: Periodicity.MONTHLY });
    expect(enrollment.isValidOn(new Date('2026-01-20T00:00:00Z'))).toBe(true);
    expect(enrollment.isValidOn(new Date('2026-03-01T00:00:00Z'))).toBe(false);
  });

  it('deixa de ser válida após cancelamento', () => {
    const enrollment = Enrollment.open({ ...base, periodicity: Periodicity.ANNUAL });
    enrollment.cancel();
    expect(enrollment.isValidOn(new Date('2026-01-20T00:00:00Z'))).toBe(false);
  });
});
