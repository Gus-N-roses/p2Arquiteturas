import { NextFunction, Request, Response } from 'express';

/**
 * Adapta tratadores assíncronos para o Express 4, encaminhando rejeições ao
 * middleware de erro central. Evita try/catch repetido em todo controlador.
 */
export function tratarAssincrono(
  tratador: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    tratador(req, res).catch(next);
  };
}
