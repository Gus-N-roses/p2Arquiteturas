import assert from 'node:assert';
import { Before, Given, Then, When } from '@cucumber/cucumber';
import { CheckInView, RegisterCheckIn } from '../../../codigo/aplicacao/casos-de-uso/RegistrarEntrada';
import { InMemoryRepositorioEntrada } from '../../../codigo/infraestrutura/repositorios/RepositorioEntradaEmMemoria';
import { ConsultaMatriculaFalsa, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

interface Mundo {
  consultaMatricula?: ConsultaMatriculaFalsa;
  resultado?: CheckInView;
}

let mundo: Mundo;

Before(() => {
  mundo = {};
});

function montarCasoDeUso(): RegisterCheckIn {
  return new RegisterCheckIn(
    mundo.consultaMatricula!,
    new InMemoryRepositorioEntrada(),
    new GeradorDeIdsSequencial('chk'),
    new RelogioFixo(new Date('2026-06-17T08:00:00Z')),
  );
}

Given('um aluno com matrícula ativa', () => {
  mundo.consultaMatricula = new ConsultaMatriculaFalsa(true);
});

Given('um aluno sem matrícula ativa', () => {
  mundo.consultaMatricula = new ConsultaMatriculaFalsa(false);
});

When('ele tenta passar pela catraca', async () => {
  mundo.resultado = await montarCasoDeUso().executar({ studentId: 'std-1' });
});

Then('o acesso deve ser liberado', () => {
  assert.strictEqual(mundo.resultado?.allowed, true);
});

Then('o acesso deve ser negado com o motivo {string}', (motivo: string) => {
  assert.strictEqual(mundo.resultado?.allowed, false);
  assert.strictEqual(mundo.resultado?.reason, motivo);
});
