import { randomUUID } from 'node:crypto';
import { GeradorDeIds } from '../../aplicacao/portas/GeradorDeIds';

export class GeradorUuid implements GeradorDeIds {
  gerar(): string {
    return randomUUID();
  }
}
