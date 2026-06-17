import { RepositorioFatura } from '../../dominio/repositorios/RepositorioFatura';
import { CasoDeUso } from '../portas/CasoDeUso';
import { InvoiceView, toView } from './EmitirFatura';

export class ListInvoices implements CasoDeUso<void, InvoiceView[]> {
  constructor(private readonly faturas: RepositorioFatura) {}

  async executar(): Promise<InvoiceView[]> {
    return (await this.faturas.list()).map(toView);
  }
}

export interface ListStudentInvoicesInput {
  studentId: string;
}

export class ListStudentInvoices implements CasoDeUso<ListStudentInvoicesInput, InvoiceView[]> {
  constructor(private readonly faturas: RepositorioFatura) {}

  async executar(entrada: ListStudentInvoicesInput): Promise<InvoiceView[]> {
    return (await this.faturas.listByStudentId(entrada.studentId)).map(toView);
  }
}
