import express, { Application } from 'express';
import { Container } from '../../principal/Composicao';
import { buildRouter } from './rotas';
import { errorHandler } from './intermediarios/tratamentoDeErros';

/**
 * Monta a aplicação Express. Separar a CRIAÇÃO do app da sua EXECUÇÃO (listen)
 * permite que os testes de integração exercitem o app em memória, sem porta.
 */
export function createApp(container: Container = Container.getInstance()): Application {
  const app = express();
  app.use(express.json());
  app.use(buildRouter(container));
  app.use(errorHandler);
  return app;
}
