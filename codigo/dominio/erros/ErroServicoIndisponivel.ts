/**
 * Erro técnico: o serviço de alunos (upstream) não respondeu. É diferente de um
 * erro de regra de negócio — vira HTTP 503, sinalizando indisponibilidade
 * temporária e não "pedido inválido".
 */
export class UpstreamUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpstreamUnavailableError';
  }
}
