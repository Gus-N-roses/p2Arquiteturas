import { Router } from 'express';
import { Container } from '../../principal/Composicao';
import { ControladorMatricula } from './controladores/ControladorMatricula';
import { ControladorPlano } from './controladores/ControladorPlano';
import { ControladorAluno } from './controladores/ControladorAluno';
import { tratarAssincrono } from './intermediarios/tratamentoAssincrono';

/**
 * Mapeia rotas HTTP para os métodos dos controladores. Recebe o Container já
 * montado (injeção de dependência) e não constrói nada por conta própria.
 */
export function buildRouter(container: Container): Router {
  const rotas = Router();

  const controladorAluno = new ControladorAluno(
    container.cadastrarAluno,
    container.listarAlunos,
  );
  const controladorMatricula = new ControladorMatricula(
    container.matricularAluno,
    container.consultarMatriculaAtiva,
  );
  const controladorPlano = new ControladorPlano(container.listarPlanos);

  rotas.get('/health', (_req, res) => res.json({ status: 'ok', service: 'servico-alunos' }));

  rotas.post('/students', tratarAssincrono(controladorAluno.criar));
  rotas.get('/students', tratarAssincrono(controladorAluno.listar));

  rotas.post('/students/:studentId/enrollments', tratarAssincrono(controladorMatricula.matricular));
  rotas.get('/students/:studentId/membership', tratarAssincrono(controladorMatricula.consultarMatricula));

  rotas.get('/plans', tratarAssincrono(controladorPlano.listar));

  return rotas;
}
