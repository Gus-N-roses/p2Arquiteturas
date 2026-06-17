import { Student } from '../entidades/Aluno';
import { Cpf } from '../objetos-de-valor/Cpf';

/**
 * REPOSITORY PATTERN (porta de saída).
 *
 * O domínio define COMO precisa persistir alunos, sem saber ONDE (memória,
 * Postgres, etc.). A camada de infraestrutura fornece a implementação. Isso
 * inverte a dependência: o núcleo não depende do banco; o banco depende do núcleo.
 */
export interface RepositorioAluno {
  save(student: Student): Promise<void>;
  findById(id: string): Promise<Student | null>;
  findByCpf(cpf: Cpf): Promise<Student | null>;
  list(): Promise<Student[]>;
}
