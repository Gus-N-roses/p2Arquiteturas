/**
 * Contrato único para todo caso de uso. Padroniza a entrada/saída e permite
 * envolver qualquer caso de uso em decorators (log, métricas, transação) sem
 * alterá-los — Open/Closed + base do Decorator Pattern.
 */
export interface CasoDeUso<Input, Output> {
  executar(entrada: Input): Promise<Output>;
}
