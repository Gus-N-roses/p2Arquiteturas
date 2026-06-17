"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = loadConfig;
/**
 * Configuração via ambiente (12-Factor). A mesma imagem do gateway roda local
 * (docker-compose) e na nuvem apenas trocando as URLs dos serviços.
 */
function loadConfig() {
    return {
        port: Number(process.env.PORT ?? 3000),
        membersUrl: process.env.MEMBERS_SERVICE_URL ?? 'http://localhost:3001',
        billingUrl: process.env.BILLING_SERVICE_URL ?? 'http://localhost:3002',
        accessUrl: process.env.ACCESS_SERVICE_URL ?? 'http://localhost:3003',
    };
}
//# sourceMappingURL=config.js.map