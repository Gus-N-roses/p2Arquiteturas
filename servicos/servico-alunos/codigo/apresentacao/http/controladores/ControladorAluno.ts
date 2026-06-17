import { Request, Response } from 'express';
import { CasoDeUso } from '../../../aplicacao/portas/CasoDeUso';
import {
  RegisterStudentInput,
  RegisterStudentOutput,
} from '../../../aplicacao/casos-de-uso/CadastrarAluno';
import { StudentView } from '../../../aplicacao/casos-de-uso/ListarAlunos';
import {
  RemoverAlunoEntrada,
  RemoverAlunoSaida,
} from '../../../aplicacao/casos-de-uso/RemoverAluno';

/**
 * Controlador fino: só traduz HTTP <-> caso de uso. Nenhuma regra de negócio
 * aqui. Depende das abstrações CasoDeUso, não das implementações concretas.
 */
export class ControladorAluno {
  constructor(
    private readonly cadastrarAluno: CasoDeUso<RegisterStudentInput, RegisterStudentOutput>,
    private readonly listarAlunos: CasoDeUso<void, StudentView[]>,
    private readonly removerAluno: CasoDeUso<RemoverAlunoEntrada, RemoverAlunoSaida>,
  ) {}

  criar = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.cadastrarAluno.executar({
      name: req.body?.name,
      cpf: req.body?.cpf,
      email: req.body?.email,
    });
    res.status(201).json(resposta);
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    const alunos = await this.listarAlunos.executar();
    res.status(200).json(alunos);
  };

  remover = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.removerAluno.executar({
      alunoId: req.params.studentId,
    });
    res.status(200).json(resposta);
  };
}
