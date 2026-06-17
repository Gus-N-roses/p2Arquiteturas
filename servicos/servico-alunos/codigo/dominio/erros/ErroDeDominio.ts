/**
 * Erro de regra de negócio. Diferencia falhas de domínio (esperadas, viram HTTP 4xx)
 * de erros técnicos inesperados (HTTP 5xx). Mantém a camada de domínio livre de
 * qualquer acoplamento com HTTP — quem traduz é a camada de apresentação.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}
