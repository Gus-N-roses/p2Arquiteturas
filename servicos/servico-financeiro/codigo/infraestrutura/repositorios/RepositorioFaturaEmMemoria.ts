import { Invoice } from '../../dominio/entidades/Fatura';
import { RepositorioFatura } from '../../dominio/repositorios/RepositorioFatura';

export class InMemoryRepositorioFatura implements RepositorioFatura {
  private readonly byId = new Map<string, Invoice>();

  async save(invoice: Invoice): Promise<void> {
    this.byId.set(invoice.id, invoice);
  }

  async findById(id: string): Promise<Invoice | null> {
    return this.byId.get(id) ?? null;
  }

  async list(): Promise<Invoice[]> {
    return [...this.byId.values()];
  }

  async listByStudentId(studentId: string): Promise<Invoice[]> {
    return [...this.byId.values()].filter((invoice) => invoice.studentId === studentId);
  }
}
