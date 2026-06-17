import { Invoice } from '../entidades/Fatura';

/**
 * REPOSITORY PATTERN — porta de persistência de faturas. O domínio define o
 * contrato; a infraestrutura decide o "onde" (memória, Postgres...).
 */
export interface RepositorioFatura {
  save(invoice: Invoice): Promise<void>;
  findById(id: string): Promise<Invoice | null>;
  list(): Promise<Invoice[]>;
  listByStudentId(studentId: string): Promise<Invoice[]>;
}
