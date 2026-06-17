import { Money } from '../objetos-de-valor/Dinheiro';
import { Periodicity } from './Periodicidade';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  CANCELLED = 'CANCELLED',
}

/**
 * Matrícula: vínculo entre um aluno e um plano, com preço já calculado e
 * período de vigência. É a fonte da verdade para "o aluno pode treinar hoje?",
 * consultada pelo serviço de controle de acesso.
 */
export class Enrollment {
  private constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly planId: string,
    public readonly price: Money,
    public readonly startsOn: Date,
    public readonly endsOn: Date,
    private _status: EnrollmentStatus,
  ) {}

  static open(params: {
    id: string;
    studentId: string;
    planId: string;
    price: Money;
    periodicity: Periodicity;
    startsOn: Date;
  }): Enrollment {
    const endsOn = Enrollment.computeEndDate(params.startsOn, params.periodicity);
    return new Enrollment(
      params.id,
      params.studentId,
      params.planId,
      params.price,
      params.startsOn,
      endsOn,
      EnrollmentStatus.ACTIVE,
    );
  }

  private static computeEndDate(start: Date, periodicity: Periodicity): Date {
    const monthsByPeriodicity: Record<Periodicity, number> = {
      [Periodicity.MONTHLY]: 1,
      [Periodicity.QUARTERLY]: 3,
      [Periodicity.ANNUAL]: 12,
    };
    const end = new Date(start);
    end.setMonth(end.getMonth() + monthsByPeriodicity[periodicity]);
    return end;
  }

  get status(): EnrollmentStatus {
    return this._status;
  }

  cancel(): void {
    this._status = EnrollmentStatus.CANCELLED;
  }

  isValidOn(date: Date): boolean {
    return (
      this._status === EnrollmentStatus.ACTIVE &&
      date >= this.startsOn &&
      date <= this.endsOn
    );
  }
}
