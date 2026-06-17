/**
 * FACADE PATTERN / API Composition.
 *
 * Esconde dos clientes o fato de que os dados de um aluno vivem em TRÊS
 * microsserviços diferentes. O front-end faz uma chamada (`/dashboard`) e o
 * portal compõe a resposta. Se um serviço falha, devolvemos os dados parciais
 * com um aviso, em vez de derrubar tudo (degradação graciosa).
 */
export interface ApiDeAlunos {
  buscarMatricula(alunoId: string): Promise<unknown>;
}
export interface ApiFinanceira {
  listarFaturas(alunoId: string): Promise<unknown[]>;
}
export interface ApiDeAcesso {
  listarEntradas(alunoId: string): Promise<unknown[]>;
}

export interface DadosPainelAluno {
  studentId: string;
  membership: unknown | null;
  invoices: unknown[];
  checkins: unknown[];
  warnings: string[];
}

export class PainelDoAluno {
  constructor(
    private readonly alunos: ApiDeAlunos,
    private readonly financeiro: ApiFinanceira,
    private readonly acesso: ApiDeAcesso,
  ) {}

  async montar(alunoId: string): Promise<DadosPainelAluno> {
    const avisos: string[] = [];

    const [matricula, faturas, entradas] = await Promise.all([
      this.comFallback(() => this.alunos.buscarMatricula(alunoId), 'servico-alunos', avisos, null),
      this.comFallback(() => this.financeiro.listarFaturas(alunoId), 'servico-financeiro', avisos, []),
      this.comFallback(() => this.acesso.listarEntradas(alunoId), 'servico-acesso', avisos, []),
    ]);

    return {
      studentId: alunoId,
      membership: matricula,
      invoices: faturas,
      checkins: entradas,
      warnings: avisos,
    };
  }

  private async comFallback<T>(
    acao: () => Promise<T>,
    nomeDoServico: string,
    avisos: string[],
    fallback: T,
  ): Promise<T> {
    try {
      return await acao();
    } catch {
      avisos.push(`Não foi possível obter dados de ${nomeDoServico}`);
      return fallback;
    }
  }
}
