import { Router } from 'express';
import { Container } from '../../principal/Composicao';
import { ControladorEntrada } from './controladores/ControladorEntrada';
import { tratarAssincrono } from './intermediarios/tratamentoAssincrono';

export function buildRouter(container: Container): Router {
  const rotas = Router();
  const controladorEntrada = new ControladorEntrada(
    container.registrarEntrada,
    container.listarEntradas,
    container.listarEntradasDoAluno,
  );

  rotas.get('/health', (_req, res) => res.json({ status: 'ok', service: 'servico-acesso' }));

  rotas.post('/checkins', tratarAssincrono(controladorEntrada.registrar));
  rotas.get('/checkins', tratarAssincrono(controladorEntrada.listar));
  rotas.get('/students/:studentId/checkins', tratarAssincrono(controladorEntrada.listarPorAluno));

  return rotas;
}
