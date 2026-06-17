/**
 * Fonte de tempo. Injetar o "agora" em vez de chamar `new Date()` no domínio
 * torna as regras dependentes de data totalmente testáveis.
 */
export interface Relogio {
  agora(): Date;
}
