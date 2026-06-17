import { Request, Response } from 'express';
import { CasoDeUso } from '../../../aplicacao/portas/CasoDeUso';
import { PlanView } from '../../../aplicacao/casos-de-uso/ListarPlanos';

export class ControladorPlano {
  constructor(private readonly listarPlanos: CasoDeUso<void, PlanView[]>) {}

  listar = async (_req: Request, res: Response): Promise<void> => {
    const planos = await this.listarPlanos.executar();
    res.status(200).json(planos);
  };
}
