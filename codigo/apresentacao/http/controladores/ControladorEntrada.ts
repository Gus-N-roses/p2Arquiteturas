import { Request, Response } from 'express';
import { CasoDeUso } from '../../../aplicacao/portas/CasoDeUso';
import { ListStudentCheckInsInput } from '../../../aplicacao/casos-de-uso/ListarEntradas';
import { CheckInView, RegisterCheckInInput } from '../../../aplicacao/casos-de-uso/RegistrarEntrada';

export class ControladorEntrada {
  constructor(
    private readonly registrarEntrada: CasoDeUso<RegisterCheckInInput, CheckInView>,
    private readonly listarEntradas: CasoDeUso<void, CheckInView[]>,
    private readonly listarEntradasDoAluno: CasoDeUso<ListStudentCheckInsInput, CheckInView[]>,
  ) {}

  registrar = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.registrarEntrada.executar({ studentId: req.body?.studentId });
    res.status(resposta.allowed ? 201 : 403).json(resposta);
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(await this.listarEntradas.executar());
  };

  listarPorAluno = async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(await this.listarEntradasDoAluno.executar({ studentId: req.params.studentId }));
  };
}
