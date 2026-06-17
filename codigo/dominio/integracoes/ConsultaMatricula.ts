/**
 * Porta para consultar a situação de matrícula de um aluno em OUTRO
 * microsserviço (servico-alunos). O domínio do controle de acesso define o
 * contrato; a infraestrutura fornece um Adapter HTTP. Assim, este serviço não
 * sabe que do outro lado existe REST/HTTP — poderia ser gRPC, fila, etc.
 */
export interface StatusMatricula {
  alunoId: string;
  ativa: boolean;
  planoId: string | null;
  terminaEm: string | null;
}

export interface ConsultaMatricula {
  obterStatus(alunoId: string): Promise<StatusMatricula>;
}
