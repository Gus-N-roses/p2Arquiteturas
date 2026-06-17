import { EnrollStudent } from '../../../codigo/aplicacao/casos-de-uso/MatricularAluno';
import { Plan } from '../../../codigo/dominio/entidades/Plano';
import { Periodicity } from '../../../codigo/dominio/entidades/Periodicidade';
import { Student } from '../../../codigo/dominio/entidades/Aluno';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { AlunoMatriculado } from '../../../codigo/dominio/eventos/AlunoMatriculado';
import { ResolvedorEstrategiaPreco } from '../../../codigo/dominio/precificacao/ResolvedorEstrategiaPreco';
import { Cpf } from '../../../codigo/dominio/objetos-de-valor/Cpf';
import { Email } from '../../../codigo/dominio/objetos-de-valor/Email';
import { Money } from '../../../codigo/dominio/objetos-de-valor/Dinheiro';
import { InMemoryRepositorioMatricula } from '../../../codigo/infraestrutura/repositorios/RepositorioMatriculaEmMemoria';
import { InMemoryRepositorioPlano } from '../../../codigo/infraestrutura/repositorios/RepositorioPlanoEmMemoria';
import { InMemoryRepositorioAluno } from '../../../codigo/infraestrutura/repositorios/RepositorioAlunoEmMemoria';
import { PublicadorDeEventosFalso, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

describe('EnrollStudent (Use Case)', () => {
  function montarCenario() {
    const aluno = Student.register({
      id: 'std-1',
      name: 'Maria Silva',
      cpf: Cpf.create('529.982.247-25'),
      email: Email.create('maria@email.com'),
    });
    const planoAnual = new Plan('plan-annual', 'Anual', Money.fromReais(120), Periodicity.ANNUAL);

    const alunos = new InMemoryRepositorioAluno();
    const planos = new InMemoryRepositorioPlano([planoAnual]);
    const matriculas = new InMemoryRepositorioMatricula();
    const eventos = new PublicadorDeEventosFalso();
    const relogio = new RelogioFixo(new Date('2026-01-10T00:00:00Z'));

    const casoDeUso = new EnrollStudent(
      alunos,
      planos,
      matriculas,
      new ResolvedorEstrategiaPreco(),
      eventos,
      new GeradorDeIdsSequencial('enr'),
      relogio,
    );

    return { casoDeUso, alunos, matriculas, eventos, aluno };
  }

  it('matricula aluno ativo calculando o preço do plano anual (com desconto)', async () => {
    const { casoDeUso, alunos, aluno, eventos } = montarCenario();
    await alunos.save(aluno);

    const resposta = await casoDeUso.executar({ studentId: 'std-1', planId: 'plan-annual' });

    expect(resposta.priceInCents).toBe(122400); // 120 * 12 - 15%
    expect(resposta.endsOn).toBe(new Date('2027-01-10T00:00:00Z').toISOString());
    // Observer: o evento de domínio foi publicado.
    expect(eventos.publicados).toHaveLength(1);
    expect(eventos.publicados[0]).toBeInstanceOf(AlunoMatriculado);
  });

  it('rejeita matrícula de aluno inexistente', async () => {
    const { casoDeUso } = montarCenario();
    await expect(casoDeUso.executar({ studentId: 'nope', planId: 'plan-annual' })).rejects.toThrow(
      DomainError,
    );
  });

  it('rejeita plano inexistente', async () => {
    const { casoDeUso, alunos, aluno } = montarCenario();
    await alunos.save(aluno);
    await expect(casoDeUso.executar({ studentId: 'std-1', planId: 'nope' })).rejects.toThrow(
      DomainError,
    );
  });

  it('impede duas matrículas ativas para o mesmo aluno', async () => {
    const { casoDeUso, alunos, aluno } = montarCenario();
    await alunos.save(aluno);
    await casoDeUso.executar({ studentId: 'std-1', planId: 'plan-annual' });

    await expect(casoDeUso.executar({ studentId: 'std-1', planId: 'plan-annual' })).rejects.toThrow(
      DomainError,
    );
  });

  it('não matricula aluno inativo', async () => {
    const { casoDeUso, alunos, aluno } = montarCenario();
    aluno.deactivate();
    await alunos.save(aluno);

    await expect(casoDeUso.executar({ studentId: 'std-1', planId: 'plan-annual' })).rejects.toThrow(
      DomainError,
    );
  });
});
