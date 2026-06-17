"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.carregarConfiguracao = carregarConfiguracao;
/**
 * Configuração via ambiente (12-Factor). A mesma imagem do portal roda local
 * (docker-compose) e na nuvem apenas trocando as URLs dos serviços.
 */
function carregarConfiguracao() {
    return {
        porta: Number(process.env.PORT ?? 3000),
        alunosUrl: process.env.URL_SERVICO_ALUNOS ?? 'http://localhost:3001',
        financeiroUrl: process.env.URL_SERVICO_FINANCEIRO ?? 'http://localhost:3002',
        acessoUrl: process.env.URL_SERVICO_ACESSO ?? 'http://localhost:3003',
    };
}
//# sourceMappingURL=configuracao.js.map