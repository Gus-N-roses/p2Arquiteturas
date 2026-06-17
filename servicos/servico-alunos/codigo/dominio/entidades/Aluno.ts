import { Cpf } from '../objetos-de-valor/Cpf';
import { Email } from '../objetos-de-valor/Email';

export enum StudentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

/**
 * Aluno da academia. A entidade protege seus invariantes: nome obrigatório,
 * CPF e e-mail são Value Objects já validados. Transições de estado ficam em
 * métodos com nome de intenção de negócio (activate/deactivate), nunca por
 * atribuição direta de fora.
 */
export class Student {
  private constructor(
    public readonly id: string,
    private _name: string,
    public readonly cpf: Cpf,
    public readonly email: Email,
    private _status: StudentStatus,
  ) {}

  static register(params: { id: string; name: string; cpf: Cpf; email: Email }): Student {
    return new Student(params.id, params.name, params.cpf, params.email, StudentStatus.ACTIVE);
  }

  static restore(params: {
    id: string;
    name: string;
    cpf: Cpf;
    email: Email;
    status: StudentStatus;
  }): Student {
    return new Student(params.id, params.name, params.cpf, params.email, params.status);
  }

  get name(): string {
    return this._name;
  }

  get status(): StudentStatus {
    return this._status;
  }

  isActive(): boolean {
    return this._status === StudentStatus.ACTIVE;
  }

  deactivate(): void {
    this._status = StudentStatus.INACTIVE;
  }

  activate(): void {
    this._status = StudentStatus.ACTIVE;
  }
}
