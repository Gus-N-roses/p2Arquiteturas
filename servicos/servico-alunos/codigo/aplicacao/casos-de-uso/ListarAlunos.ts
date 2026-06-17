import { RepositorioAluno } from '../../dominio/repositorios/RepositorioAluno';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface StudentView {
  id: string;
  name: string;
  cpf: string;
  email: string;
  status: string;
}

export class ListStudents implements CasoDeUso<void, StudentView[]> {
  constructor(private readonly alunos: RepositorioAluno) {}

  async executar(): Promise<StudentView[]> {
    const alunos = await this.alunos.list();
    return alunos.map((aluno) => ({
      id: aluno.id,
      name: aluno.name,
      cpf: aluno.cpf.format(),
      email: aluno.email.value,
      status: aluno.status,
    }));
  }
}
