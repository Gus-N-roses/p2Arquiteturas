import { Relogio } from '../../aplicacao/portas/Relogio';

export class RelogioSistema implements Relogio {
  agora(): Date {
    return new Date();
  }
}
