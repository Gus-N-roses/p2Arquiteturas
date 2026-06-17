import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../../../dominio/erros/ErroDeDominio';

/** Tradução única de erros de domínio (400) e inesperados (500) para HTTP. */
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
  // eslint-disable-next-line no-console
  console.error('Erro inesperado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
