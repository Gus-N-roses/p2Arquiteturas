import { Student } from '../../dominio/entidades/Aluno';
import { RepositorioAluno } from '../../dominio/repositorios/RepositorioAluno';
import { Cpf } from '../../dominio/objetos-de-valor/Cpf';

/**
 * Implementação do RepositorioAluno em memória. Cumpre o contrato do domínio
 * sem nenhuma dependência externa — o que mantém testes e deploy triviais.
 * Trocar por Postgres é só fornecer outra classe que implemente a mesma porta,
 * sem alterar uma linha de domínio ou de caso de uso (Liskov + DIP).
 */
export class InMemoryRepositorioAluno implements RepositorioAluno {
  private readonly byId = new Map<string, Student>();

  async save(student: Student): Promise<void> {
    this.byId.set(student.id, student);
  }

  async findById(id: string): Promise<Student | null> {
    return this.byId.get(id) ?? null;
  }

  async findByCpf(cpf: Cpf): Promise<Student | null> {
    for (const student of this.byId.values()) {
      if (student.cpf.equals(cpf)) {
        return student;
      }
    }
    return null;
  }

  async list(): Promise<Student[]> {
    return [...this.byId.values()];
  }
}
