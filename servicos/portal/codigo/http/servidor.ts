import path from 'node:path';
import express, { Application } from 'express';
import { carregarConfiguracao, ConfiguracaoServicos } from '../configuracao';
import {
  ApiHttpDeAcesso,
  ApiHttpDeAlunos,
  ApiHttpFinanceira,
} from '../agregacao/ApisHttpDosServicos';
import { PainelDoAluno } from '../agregacao/PainelDoAluno';
import { montarRotasDoPortal } from './rotasDoPortal';

export function createApp(config: ConfiguracaoServicos = carregarConfiguracao()): Application {
  const app = express();
  const pastaPublica = path.resolve(__dirname, '../../publico');

  // Console visual de testes (HTML estático) servido na raiz "/".
  app.get('/', (_req, res) => res.sendFile(path.join(pastaPublica, 'inicio.html')));
  app.use(express.static(pastaPublica));

  app.get('/health', (_req, res) =>
    res.json({ status: 'ok', service: 'portal', routes: ['/api/members', '/api/billing', '/api/access'] }),
  );

  // Índice das rotas em JSON (a UI fica na raiz).
  app.get('/info', (_req, res) => {
    res.json({
      service: 'Gym Control - Portal de APIs',
      tente: {
        planos: 'GET /api/members/plans',
        alunos: 'GET /api/members/students',
        cadastrarAluno: 'POST /api/members/students {name, cpf, email}',
        matricular: 'POST /api/members/students/:id/enrollments {planId}',
        emitirFatura: 'POST /api/billing/invoices {studentId, description, amountInCents, dueDate}',
        pagarFatura: 'POST /api/billing/invoices/:id/payment {paidAt}',
        checkin: 'POST /api/access/checkins {studentId}',
        dashboard: 'GET /api/students/:id/dashboard',
      },
    });
  });

  // Endpoint agregado (Facade): uma chamada, dados dos três serviços.
  const painelDoAluno = new PainelDoAluno(
    new ApiHttpDeAlunos(config.alunosUrl),
    new ApiHttpFinanceira(config.financeiroUrl),
    new ApiHttpDeAcesso(config.acessoUrl),
  );
  app.get('/api/students/:studentId/dashboard', async (req, res) => {
    res.json(await painelDoAluno.montar(req.params.studentId));
  });

  // Proxies para cada microsserviço (devem vir depois das rotas próprias).
  montarRotasDoPortal(app, config);

  return app;
}
