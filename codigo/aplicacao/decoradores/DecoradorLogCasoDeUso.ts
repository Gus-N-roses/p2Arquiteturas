import { Registrador } from '../portas/Registrador';
import { CasoDeUso } from '../portas/CasoDeUso';

/** DECORATOR PATTERN — observabilidade ao redor de qualquer caso de uso. */
export class DecoradorLogCasoDeUso<Input, Output> implements CasoDeUso<Input, Output> {
  constructor(
    private readonly nomeDoCasoDeUso: string,
    private readonly casoDecorado: CasoDeUso<Input, Output>,
    private readonly registrador: Registrador,
  ) {}

  async executar(entrada: Input): Promise<Output> {
    const iniciadoEm = Date.now();
    this.registrador.informar(`▶ ${this.nomeDoCasoDeUso} iniciado`);
    try {
      const saida = await this.casoDecorado.executar(entrada);
      this.registrador.informar(`✔ ${this.nomeDoCasoDeUso} concluído`, { ms: Date.now() - iniciadoEm });
      return saida;
    } catch (error) {
      this.registrador.erro(`✖ ${this.nomeDoCasoDeUso} falhou`, {
        ms: Date.now() - iniciadoEm,
        reason: (error as Error).message,
      });
      throw error;
    }
  }
}
