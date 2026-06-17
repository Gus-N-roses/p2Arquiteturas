import { DomainError } from '../erros/ErroDeDominio';
import { Money } from '../objetos-de-valor/Dinheiro';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
}

/**
 * Fatura (mensalidade) de um aluno. Protege seus invariantes: só pode ser paga
 * uma vez, guarda quanto foi efetivamente pago e quando. A regra de "está
 * vencida?" mora aqui, perto dos dados que ela usa (alta coesão).
 */
export class Invoice {
  private constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly description: string,
    public readonly amount: Money,
    public readonly dueDate: Date,
    private _status: InvoiceStatus,
    private _paidAt: Date | null,
    private _amountPaid: Money | null,
  ) {}

  static issue(params: {
    id: string;
    studentId: string;
    description: string;
    amount: Money;
    dueDate: Date;
  }): Invoice {
    if (params.description.trim().length === 0) {
      throw new DomainError('Descrição da fatura é obrigatória');
    }
    return new Invoice(
      params.id,
      params.studentId,
      params.description,
      params.amount,
      params.dueDate,
      InvoiceStatus.PENDING,
      null,
      null,
    );
  }

  static restore(params: {
    id: string;
    studentId: string;
    description: string;
    amount: Money;
    dueDate: Date;
    status: InvoiceStatus;
    paidAt: Date | null;
    amountPaid: Money | null;
  }): Invoice {
    return new Invoice(
      params.id,
      params.studentId,
      params.description,
      params.amount,
      params.dueDate,
      params.status,
      params.paidAt,
      params.amountPaid,
    );
  }

  get status(): InvoiceStatus {
    return this._status;
  }

  get paidAt(): Date | null {
    return this._paidAt;
  }

  get amountPaid(): Money | null {
    return this._amountPaid;
  }

  isPaid(): boolean {
    return this._status === InvoiceStatus.PAID;
  }

  daysOverdue(reference: Date): number {
    const millisPerDay = 1000 * 60 * 60 * 24;
    const diff = Math.floor((reference.getTime() - this.dueDate.getTime()) / millisPerDay);
    return diff > 0 ? diff : 0;
  }

  pay(amountPaid: Money, paidAt: Date): void {
    if (this.isPaid()) {
      throw new DomainError('Fatura já está paga');
    }
    this._status = InvoiceStatus.PAID;
    this._amountPaid = amountPaid;
    this._paidAt = paidAt;
  }
}
