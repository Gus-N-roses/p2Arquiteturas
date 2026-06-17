/**
 * Erro de regra de negócio do contexto financeiro. Cada microsserviço tem o seu
 * próprio "shared kernel" (Money, DomainError) — duplicação consciente que
 * preserva a INDEPENDÊNCIA dos serviços (nenhuma lib compartilhada acopla os
 * deploys entre si).
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
