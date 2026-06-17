import { RegisterCheckIn } from '../../../codigo/aplicacao/casos-de-uso/RegistrarEntrada';
import { DomainError } from '../../../codigo/dominio/erros/ErroDeDominio';
import { UpstreamUnavailableError } from '../../../codigo/dominio/erros/ErroServicoIndisponivel';
import { InMemoryRepositorioEntrada } from '../../../codigo/infraestrutura/repositorios/RepositorioEntradaEmMemoria';
import { ConsultaMatriculaFalsa, RelogioFixo, GeradorDeIdsSequencial } from '../../suporte/dubles';

describe('RegisterCheckIn (Use Case)', () => {
  function montarCenario(consultaMatricula: ConsultaMatriculaFalsa) {
    const entradas = new InMemoryRepositorioEntrada();
    const casoDeUso = new RegisterCheckIn(
      consultaMatricula,
      entradas,
      new GeradorDeIdsSequencial('chk'),
      new RelogioFixo(new Date('2026-06-17T08:00:00Z')),
    );
    return { casoDeUso, entradas };
  }

  it('libera o acesso quando o aluno tem matrícula ativa', async () => {
    const { casoDeUso, entradas } = montarCenario(new ConsultaMatriculaFalsa(true));

    const resultado = await casoDeUso.executar({ studentId: 'std-1' });

    expect(resultado.allowed).toBe(true);
    expect(resultado.reason).toBeNull();
    expect(await entradas.list()).toHaveLength(1);
  });

  it('nega o acesso e registra o motivo quando não há matrícula ativa', async () => {
    const { casoDeUso, entradas } = montarCenario(new ConsultaMatriculaFalsa(false));

    const resultado = await casoDeUso.executar({ studentId: 'std-1' });

    expect(resultado.allowed).toBe(false);
    expect(resultado.reason).toBe('Aluno sem matrícula ativa');
    // Mesmo negado, a tentativa é auditada.
    expect(await entradas.list()).toHaveLength(1);
  });

  it('exige studentId', async () => {
    const { casoDeUso } = montarCenario(new ConsultaMatriculaFalsa(true));
    await expect(casoDeUso.executar({ studentId: '  ' })).rejects.toThrow(DomainError);
  });

  it('propaga indisponibilidade do servico-alunos', async () => {
    const { casoDeUso } = montarCenario(ConsultaMatriculaFalsa.indisponivel());
    await expect(casoDeUso.executar({ studentId: 'std-1' })).rejects.toThrow(
      UpstreamUnavailableError,
    );
  });
});
