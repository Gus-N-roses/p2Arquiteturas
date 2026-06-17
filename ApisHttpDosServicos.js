"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiHttpDeAcesso = exports.ApiHttpFinanceira = exports.ApiHttpDeAlunos = void 0;
/** Adapter HTTP genérico para GET de JSON, com timeout. */
async function buscarJson(url, tempoLimiteMs = 3000) {
    const controlador = new AbortController();
    const temporizador = setTimeout(() => controlador.abort(), tempoLimiteMs);
    try {
        const resposta = await fetch(url, { signal: controlador.signal });
        if (!resposta.ok) {
            throw new Error(`${url} respondeu ${resposta.status}`);
        }
        return (await resposta.json());
    }
    finally {
        clearTimeout(temporizador);
    }
}
/** Adapters concretos que implementam as portas usadas pela Facade. */
class ApiHttpDeAlunos {
    constructor(urlBase) {
        this.urlBase = urlBase;
    }
    buscarMatricula(alunoId) {
        return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/membership`);
    }
}
exports.ApiHttpDeAlunos = ApiHttpDeAlunos;
class ApiHttpFinanceira {
    constructor(urlBase) {
        this.urlBase = urlBase;
    }
    listarFaturas(alunoId) {
        return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/invoices`);
    }
}
exports.ApiHttpFinanceira = ApiHttpFinanceira;
class ApiHttpDeAcesso {
    constructor(urlBase) {
        this.urlBase = urlBase;
    }
    listarEntradas(alunoId) {
        return buscarJson(`${this.urlBase}/students/${encodeURIComponent(alunoId)}/checkins`);
    }
}
exports.ApiHttpDeAcesso = ApiHttpDeAcesso;
//# sourceMappingURL=ApisHttpDosServicos.js.map