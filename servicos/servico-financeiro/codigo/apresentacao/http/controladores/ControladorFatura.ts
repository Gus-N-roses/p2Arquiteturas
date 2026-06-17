import { Request, Response } from 'express';
import { CasoDeUso } from '../../../aplicacao/portas/CasoDeUso';
import { CreateInvoiceInput, InvoiceView } from '../../../aplicacao/casos-de-uso/EmitirFatura';
import { ListStudentInvoicesInput } from '../../../aplicacao/casos-de-uso/ListarFaturas';
import { PayInvoiceInput, PaymentReceipt } from '../../../aplicacao/casos-de-uso/PagarFatura';

/** Controlador fino: traduz HTTP <-> casos de uso de faturamento. */
export class ControladorFatura {
  constructor(
    private readonly emitirFatura: CasoDeUso<CreateInvoiceInput, InvoiceView>,
    private readonly pagarFatura: CasoDeUso<PayInvoiceInput, PaymentReceipt>,
    private readonly listarFaturas: CasoDeUso<void, InvoiceView[]>,
    private readonly listarFaturasDoAluno: CasoDeUso<ListStudentInvoicesInput, InvoiceView[]>,
  ) {}

  emitir = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.emitirFatura.executar({
      studentId: req.body?.studentId,
      description: req.body?.description,
      amountInCents: req.body?.amountInCents,
      dueDate: req.body?.dueDate,
    });
    res.status(201).json(resposta);
  };

  pagar = async (req: Request, res: Response): Promise<void> => {
    const resposta = await this.pagarFatura.executar({
      invoiceId: req.params.invoiceId,
      paidAt: req.body?.paidAt,
    });
    res.status(200).json(resposta);
  };

  listar = async (_req: Request, res: Response): Promise<void> => {
    res.status(200).json(await this.listarFaturas.executar());
  };

  listarPorAluno = async (req: Request, res: Response): Promise<void> => {
    res
      .status(200)
      .json(await this.listarFaturasDoAluno.executar({ studentId: req.params.studentId }));
  };
}
