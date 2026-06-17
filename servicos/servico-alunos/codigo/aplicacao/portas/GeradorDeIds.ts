/**
 * Geração de identificadores. Abstraída para que os casos de uso permaneçam
 * determinísticos nos testes (um gerador sequencial fake) e o domínio não
 * dependa de `crypto`/UUID diretamente.
 */
export interface GeradorDeIds {
  gerar(): string;
}
