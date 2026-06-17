import { NextFunction, Request, Response } from 'express';
import { DomainError } from '../../../dominio/erros/ErroDeDominio';

/**
 * Tradução única de erros para HTTP. O domínio nunca conhece status codes;
 * é aqui que um DomainError vira 400 e qualquer outro erro vira 500. Manter
 * isso centralizado é Single Responsibility e Clean Code (sem try/catch
 * espalhado mapeando exceções para respostas).
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

  // eslint-disable-next-line no-console
  console.error('Erro inesperado:', error);
  res.status(500).json({ error: 'Erro interno do servidor' });
}
