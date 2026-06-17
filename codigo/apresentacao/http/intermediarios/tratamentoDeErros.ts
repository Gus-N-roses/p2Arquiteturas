import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../../../dominio/erros/ErroDeDominio';
import { UpstreamUnavailableError } from '../../../dominio/erros/ErroServicoIndisponivel';

/**
 * Mapeia cada tipo de erro para o status HTTP correto, num único lugar:
 *  - DomainError -> 400 (pedido inválido)
 *  - UpstreamUnavailableError -> 503 (servico-alunos fora do ar)
 *  - demais -> 500
 */
export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (error instanceof DomainError) {
    res.status(400).json({ error: error.message });
    return;
  }
  if (error instanceof UpstreamUnavailableError) {
    res.status(503).json({ error: error.message });
    return;
  }
  // eslint-disable-next-line no-console
  console.error('Erro inesperado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
