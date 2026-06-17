import { NextFunction, Request, Response } from 'express';

export function tratarAssincrono(
  tratador: (req: Request, res: Response) => Promise<void>,
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    tratador(req, res).catch(next);
  };
}
