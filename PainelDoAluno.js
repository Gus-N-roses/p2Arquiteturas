"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PainelDoAluno = void 0;
class PainelDoAluno {
    constructor(alunos, financeiro, acesso) {
        this.alunos = alunos;
        this.financeiro = financeiro;
        this.acesso = acesso;
    }
    async montar(alunoId) {
        const avisos = [];
        const [matricula, faturas, entradas] = await Promise.all([
            this.comFallback(() => this.alunos.buscarMatricula(alunoId), 'members-service', avisos, null),
            this.comFallback(() => this.financeiro.listarFaturas(alunoId), 'billing-service', avisos, []),
            this.comFallback(() => this.acesso.listarEntradas(alunoId), 'access-service', avisos, []),
        ]);
        return {
            studentId: alunoId,
            membership: matricula,
            invoices: faturas,
            checkins: entradas,
            warnings: avisos,
        };
    }
    async comFallback(acao, nomeDoServico, avisos, fallback) {
        try {
            return await acao();
        }
        catch {
            avisos.push(`Não foi possível obter dados de ${nomeDoServico}`);
            return fallback;
        }
    }
}
exports.PainelDoAluno = PainelDoAluno;
//# sourceMappingURL=PainelDoAluno.js.map