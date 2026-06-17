import { ApiDeAcesso, ApiDeAlunos, ApiFinanceira } from './PainelDoAluno';

/** Adapter HTTP genérico para GET de JSON, com timeout. */
async function buscarJson<T>(url: string, tempoLimiteMs = 3000): Promise<T> {
  const controlador = new AbortController();
  const temporizador = setTimeout(() => controlador.abort(), tempoLimiteMs);
  try {
    const resposta = await fetch(url, { signal: controlador.signal });
    if (!resposta.ok) {
      throw new Error(`${url} respondeu ${resposta.status}`);
    }
    return (await resposta.json()) as T;
  } finally {
    clearTimeout(temporizador);
  }
}

/** Adapters concretos que implementam as portas usadas pela Facade. */
export class ApiHttpDeAlunos implements ApiDeAlunos {
  constructor(private readonly urlBase: string) {}
  buscarMatricula(alunoId: string): Promise<unknown> {
    return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/membership`);
  }
}

export class ApiHttpFinanceira implements ApiFinanceira {
  constructor(private readonly urlBase: string) {}
  listarFaturas(alunoId: string): Promise<unknown[]> {
    return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/invoices`);
  }
}

export class ApiHttpDeAcesso implements ApiDeAcesso {
  constructor(private readonly urlBase: string) {}
  listarEntradas(alunoId: string): Promise<unknown[]> {
    return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/checkins`);
  }
}
