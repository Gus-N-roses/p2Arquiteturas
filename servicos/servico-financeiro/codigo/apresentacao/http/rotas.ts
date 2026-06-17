import { Router } from 'express';
import { Container } from '../../principal/Composicao';
import { ControladorFatura } from './controladores/ControladorFatura';
import { tratarAssincrono } from './intermediarios/tratamentoAssincrono';

export function buildRouter(container: Container): Router {
  const rotas = Router();
  const controladorFatura = new ControladorFatura(
    container.emitirFatura,
    container.pagarFatura,
    container.listarFaturas,
    container.listarFaturasDoAluno,
  );

  rotas.get('/health', (_req, res) => res.json({ status: 'ok', service: 'servico-financeiro' }));

  rotas.post('/invoices', tratarAssincrono(controladorFatura.emitir));
  rotas.get('/invoices', tratarAssincrono(controladorFatura.listar));
  rotas.post('/invoices/:invoiceId/payment', tratarAssincrono(controladorFatura.pagar));
  rotas.get('/students/:studentId/invoices', tratarAssincrono(controladorFatura.listarPorAluno));

  return rotas;
}
