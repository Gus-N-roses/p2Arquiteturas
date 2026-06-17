"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mountProxies = mountProxies;
const http_proxy_middleware_1 = require("http-proxy-middleware");
/**
 * PROXY PATTERN — encaminha as rotas públicas para o microsserviço dono de cada
 * contexto, reescrevendo o prefixo. O cliente externo fala só com o gateway e
 * desconhece a topologia interna (portas, nomes de container).
 */
function mountProxies(app, config) {
    app.use('/api/members', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: config.membersUrl,
        changeOrigin: true,
        pathRewrite: { '^/api/members': '' },
    }));
    app.use('/api/billing', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: config.billingUrl,
        changeOrigin: true,
        pathRewrite: { '^/api/billing': '' },
    }));
    app.use('/api/access', (0, http_proxy_middleware_1.createProxyMiddleware)({
        target: config.accessUrl,
        changeOrigin: true,
        pathRewrite: { '^/api/access': '' },
    }));
}
//# sourceMappingURL=proxies.js.map