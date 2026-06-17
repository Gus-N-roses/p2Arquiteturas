import assert from 'node:assert';
import { Before, Given, Then, When } from '@cucumber/cucumber';
import { EnrollStudent, EnrollStudentOutput } from '../../../codigo/aplicacao/casos-de-uso/MatricularAluno';
import { Plan } from '../../../codigo/dominio/entidades/Plano';
import { Periodicity } from '../../../codigo/dominio/entidades/Periodicidade';
import { Student } from '../../../codigo/dominio/entidades/Aluno';
import { ResolvedorEstrategiaPreco } from '../../../codigo/dominio/precificacao/ResolvedorEstrategiaPreco';
import { Cpf } from '../../../codigo/dominio/objetos-de-valor/Cpf';
import { Email } from '../../../codigo/dominio/objetos-de-valor/Email';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';
import { InMemoryRepositorioMatricula } from '../../../codigo/infraestrutura/repositorios/RepositorioMatriculaEmMemoria';
import { InMemoryRepositorioPlano } from '../../../codigo/infraestrutura/repositorios/RepositorioPlanoEmMemoria';
import { InMemoryRepositorioAluno } from '../../../codigo/infraestrutura/repositorios/RepositorioAlunoEmMemoria';
import { PublicadorDeEventosFalso, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

/**
 * Estado compartilhado entre os passos de um cenário. Reconstruído a cada
 * cenário (hook Before) para garantir isolamento.
 */
interface Mundo {
  alunos: InMemoryRepositorioAluno;
  planos: InMemoryRepositorioPlano;
  matriculas: InMemoryRepositorioMatricula;
  matricularAluno: EnrollStudent;
  alunoId: string;
  ultimaResposta?: EnrollStudentOutput;
  ultimoErro?: Error;
}

let mundo: Mundo;

Before(() => {
  const alunos = new InMemoryRepositorioAluno();
  const planos = new InMemoryRepositorioPlano();
  const matriculas = new InMemoryRepositorioMatricula();
  mundo = {
    alunos,
    planos,
    matriculas,
    alunoId: '',
    matricularAluno: new EnrollStudent(
      alunos,
      planos,
      matriculas,
      new ResolvedorEstrategiaPreco(),
      new PublicadorDeEventosFalso(),
      new GeradorDeIdsSequencial('enr'),
      new RelogioFixo(new Date('2026-01-10T00:00:00Z')),
    ),
  };
});

Given('um aluno cadastrado chamado {string}', async (nome: string) => {
  const aluno = Student.register({
    id: 'std-1',
    name: nome,
    cpf: Cpf.create('529.982.247-25'),
    email: Email.create('joao@email.com'),
  });
  await mundo.alunos.save(aluno);
  mundo.alunoId = aluno.id;
});

Given('existe o plano anual {string} a {int} reais por mês', async (planId: string, reais: number) => {
  const plano = new Plan(planId, 'Plano Anual', Money.fromReais(reais), Periodicity.ANNUAL);
  mundo.planos.add(plano);
});

Given('o aluno já está matriculado no plano {string}', async (planId: string) => {
  await mundo.matricularAluno.executar({ studentId: mundo.alunoId, planId });
});

When('eu matriculo o aluno no plano {string}', async (planId: string) => {
  mundo.ultimaResposta = await mundo.matricularAluno.executar({ studentId: mundo.alunoId, planId });
});

When('eu tento matricular o aluno novamente no plano {string}', async (planId: string) => {
  try {
    mundo.ultimaResposta = await mundo.matricularAluno.executar({ studentId: mundo.alunoId, planId });
  } catch (error) {
    mundo.ultimoErro = error as Error;
  }
});

Then('a matrícula deve ser criada com sucesso', () => {
  assert.ok(mundo.ultimaResposta, 'esperava uma matrícula criada');
});

Then('o valor da matrícula deve ser de {int} reais', (reais: number) => {
  assert.strictEqual(mundo.ultimaResposta?.priceInCents, reais * 100);
});

Then('a matrícula deve ser recusada com a mensagem {string}', (mensagem: string) => {
  assert.ok(mundo.ultimoErro, 'esperava um erro');
  assert.strictEqual(mundo.ultimoErro?.message, mensagem);
});
