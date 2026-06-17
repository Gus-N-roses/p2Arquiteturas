export interface CasoDeUso<Input, Output> {
  executar(entrada: Input): Promise<Output>;
}
