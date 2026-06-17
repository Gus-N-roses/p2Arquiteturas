import {
  ApiDeAcesso,
  ApiDeAlunos,
  ApiFinanceira,
  PainelDoAluno,
} from '../codigo/agregacao/PainelDoAluno';

const matricula = { studentId: 'std-1', active: true };
const faturas = [{ id: 'inv-1' }];
const entradas = [{ id: 'chk-1' }];

const alunosOk: ApiDeAlunos = { buscarMatricula: async () => matricula };
const financeiroOk: ApiFinanceira = { listarFaturas: async () => faturas };
const acessoOk: ApiDeAcesso = { listarEntradas: async () => entradas };

describe('PainelDoAluno (Facade / agregação)', () => {
  it('compõe os dados dos três serviços em uma única resposta', async () => {
    const casoDeTeste = new PainelDoAluno(alunosOk, financeiroOk, acessoOk);

    const dados = await casoDeTeste.montar('std-1');

    expect(dados.membership).toEqual(matricula);
    expect(dados.invoices).toEqual(faturas);
    expect(dados.checkins).toEqual(entradas);
    expect(dados.warnings).toHaveLength(0);
  });

  it('degrada graciosamente quando um serviço falha (dados parciais + aviso)', async () => {
    const financeiroComFalha: ApiFinanceira = {
      listarFaturas: async () => {
        throw new Error('connection refused');
      },
    };
    const casoDeTeste = new PainelDoAluno(alunosOk, financeiroComFalha, acessoOk);

    const dados = await casoDeTeste.montar('std-1');

    expect(dados.membership).toEqual(matricula);
    expect(dados.invoices).toEqual([]); // fallback
    expect(dados.checkins).toEqual(entradas);
    expect(dados.warnings).toContain('Não foi possível obter dados de servico-financeiro');
  });
});
