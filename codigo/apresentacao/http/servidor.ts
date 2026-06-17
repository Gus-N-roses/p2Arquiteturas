import express, { Application } from 'express';
import { Container } from '../../principal/Composicao';
import { buildRouter } from './rotas';
import { errorHandler } from './intermediarios/tratamentoDeErros';

export function createApp(container: Container = Container.getInstance()): Application {
  const app = express();
  app.use(express.json());
  app.use(buildRouter(container));
  app.use(errorHandler);
  return app;
}
