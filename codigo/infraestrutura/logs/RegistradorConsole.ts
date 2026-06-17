import { Registrador } from '../../aplicacao/portas/Registrador';

export class RegistradorConsole implements Registrador {
  constructor(private readonly service = 'servico-acesso') {}

  informar(message: string, context: Record<string, unknown> = {}): void {
    this.write('info', message, context);
  }

  erro(message: string, context: Record<string, unknown> = {}): void {
    this.write('error', message, context);
  }

  private write(level: string, message: string, context: Record<string, unknown>): void {
    const line = { level, service: this.service, message, ...context, at: new Date().toISOString() };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(line));
  }
}
