import { UpstreamUnavailableError } from '../../dominio/erros/ErroServicoIndisponivel';
import { ConsultaMatricula, StatusMatricula } from '../../dominio/integracoes/ConsultaMatricula';
import { Registrador } from '../../aplicacao/portas/Registrador';

/**
 * ADAPTER PATTERN
 *
 * Adapta a API HTTP do servico-alunos ao contrato ConsultaMatricula que o
 * domínio espera. Concentra detalhes de transporte (URL, timeout, JSON, erros
 * de rede) num único lugar. Inclui timeout para não deixar a catraca pendurada
 * caso o serviço de alunos esteja lento (resiliência).
 */
export class ConsultaHttpMatricula implements ConsultaMatricula {
  constructor(
    private readonly baseUrl: string,
    private readonly registrador: Registrador,
    private readonly timeoutMs = 3000,
  ) {}

  async obterStatus(alunoId: string): Promise<StatusMatricula> {
    const url = `${this.baseUrl}/students/${encodeURIComponent(alunoId)}/membership`;
    const controladorAborto = new AbortController();
    const timer = setTimeout(() => controladorAborto.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, { signal: controladorAborto.signal });
      if (!response.ok) {
        throw new UpstreamUnavailableError(
          `servico-alunos respondeu ${response.status} ao consultar matrícula`,
        );
      }
      const body = (await response.json()) as {
        studentId?: string;
        active?: boolean;
        planId?: string | null;
        endsOn?: string | null;
      };
      return {
        alunoId: body.studentId ?? alunoId,
        ativa: Boolean(body.active),
        planoId: body.planId ?? null,
        terminaEm: body.endsOn ?? null,
      };
    } catch (error) {
      if (error instanceof UpstreamUnavailableError) {
        throw error;
      }
      this.registrador.erro('Falha ao consultar servico-alunos', {
        url,
        reason: (error as Error).message,
      });
      throw new UpstreamUnavailableError('servico-alunos indisponível');
    } finally {
      clearTimeout(timer);
    }
  }
}
