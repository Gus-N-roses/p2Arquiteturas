import { Request, Response } from 'express';
import { CasoDeUso } from '../../../aplicacao/portas/CasoDeUso';
import {
  CheckActiveMembershipInput,
  CheckActiveMembershipOutput,
} from '../../../aplicacao/casos-de-uso/ConsultarMatriculaAtiva';
import {
  EnrollStudentInput,
  EnrollStudentOutput,
} from '../../../aplicacao/casos-de-uso/MatricularAluno';

export class ControladorMatricula {
  constructor(
    private readonly matricularAluno: CasoDeUso<EnrollStudentInput, EnrollStudentOutput>,
    private readonly consultarMatriculaAtiva: CasoDeUso<
      CheckActiveMembershipInput,
      CheckActiveMembershipOutput
    >,
  ) {}

  matricular = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.matricularAluno.executar({
      studentId: req.params.studentId,
      planId: req.body?.planId,
    });
    res.status(201).json(resposta);
  };

  consultarMatricula = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.consultarMatriculaAtiva.executar({
      studentId: req.params.studentId,
    });
    res.status(200).json(resposta);
  };
}
