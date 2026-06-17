import { Application } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ConfiguracaoServicos } from '../configuracao';

/**
 * PROXY PATTERN — encaminha as rotas públicas para o microsserviço dono de cada
 * contexto, reescrevendo o prefixo. O cliente externo fala só com o portal e
 * desconhece a topologia interna (portas, nomes de container).
 */
export function montarRotasDoPortal(app: Application, config: ConfiguracaoServicos): void {
  app.use(
    '/api/members',
    createProxyMiddleware({
      target: config.alunosUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/members': '' },
    }),
  );

  app.use(
    '/api/billing',
    createProxyMiddleware({
      target: config.financeiroUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/billing': '' },
    }),
  );

  app.use(
    '/api/access',
    createProxyMiddleware({
      target: config.acessoUrl,
      changeOrigin: true,
      pathRewrite: { '^/api/access': '' },
    }),
  );
}
