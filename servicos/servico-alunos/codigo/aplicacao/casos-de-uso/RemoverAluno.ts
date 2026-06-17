import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { RepositorioAluno } from '../../dominio/repositorios/RepositorioAluno';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface RemoverAlunoEntrada {
  alunoId: string;
}

export interface RemoverAlunoSaida {
  id: string;
  removido: true;
}

/**
 * Caso de uso: remover um aluno cadastrado.
 *
 * A regra fica na aplicação para manter o controlador fino e preservar a
 * arquitetura limpa: HTTP só traduz a chamada, quem decide é o caso de uso.
 */
export class RemoverAluno implements CasoDeUso<RemoverAlunoEntrada, RemoverAlunoSaida> {
  constructor(private readonly alunos: RepositorioAluno) {}

  async executar(entrada: RemoverAlunoEntrada): Promise<RemoverAlunoSaida> {
    const alunoId = entrada.alunoId?.trim();
    if (!alunoId) {
      throw new DomainError('Informe o aluno que deve ser removido');
    }

    const aluno = await this.alunos.findById(alunoId);
    if (!aluno) {
      throw new DomainError(`Aluno ${alunoId} não encontrado`);
    }

    await this.alunos.remover(aluno.id);
    return { id: aluno.id, removido: true };
  }
}
