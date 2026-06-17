export interface Registrador {
  informar(message: string, context?: Record<string, unknown>): void;
  erro(message: string, context?: Record<string, unknown>): void;
}
