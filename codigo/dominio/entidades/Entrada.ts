/**
 * Registro de uma tentativa de entrada na academia (catraca). Guarda se foi
 * liberada ou negada e o motivo — fonte para auditoria e relatórios de fluxo.
 */
export class CheckIn {
  private constructor(
    public readonly id: string,
    public readonly studentId: string,
    public readonly occurredAt: Date,
    public readonly allowed: boolean,
    public readonly reason: string | null,
  ) {}

  static allow(params: { id: string; studentId: string; occurredAt: Date }): CheckIn {
    return new CheckIn(params.id, params.studentId, params.occurredAt, true, null);
  }

  static deny(params: {
    id: string;
    studentId: string;
    occurredAt: Date;
    reason: string;
  }): CheckIn {
    return new CheckIn(params.id, params.studentId, params.occurredAt, false, params.reason);
  }
}
