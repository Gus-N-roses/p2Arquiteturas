import { Student } from '../../dominio/entidades/Aluno';
import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { RepositorioAluno } from '../../dominio/repositorios/RepositorioAluno';
import { Cpf } from '../../dominio/objetos-de-valor/Cpf';
import { Email } from '../../dominio/objetos-de-valor/Email';
import { GeradorDeIds } from '../portas/GeradorDeIds';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface RegisterStudentInput {
  name: string;
  cpf: string;
  email: string;
}

export interface RegisterStudentOutput {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status: string;
}

/**
 * Caso de uso: cadastrar um aluno.
 *
 * Depende apenas de abstrações (RepositorioAluno, GeradorDeIds) recebidas via
 * construtor — Dependency Inversion. Não conhece HTTP nem banco de dados.
 */
export class RegisterStudent implements CasoDeUso<RegisterStudentInput, RegisterStudentOutput> {
  constructor(
    private readonly alunos: RepositorioAluno,
    private readonly geradorDeIds: GeradorDeIds,
  ) {}

  async executar(entrada: RegisterStudentInput): Promise<RegisterStudentOutput> {
    const nome = (entrada.name ?? '').trim();
    if (nome.length < 3) {
      throw new DomainError('Nome do aluno deve ter ao menos 3 caracteres');
    }

    const cpf = Cpf.create(entrada.cpf);
    const email = Email.create(entrada.email);

    const alunoExistente = await this.alunos.findByCpf(cpf);
    if (alunoExistente) {
      throw new DomainError(`Já existe um aluno com o CPF ${cpf.format()}`);
    }

    const aluno = Student.register({ id: this.geradorDeIds.gerar(), name: nome, cpf, email });
    await this.alunos.save(aluno);

    return {
      id: aluno.id,
      name: aluno.name,
      cpf: aluno.cpf.format(),
      email: aluno.email.value,
      status: aluno.status,
    };
  }
}
