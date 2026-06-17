import { CheckIn } from '../../dominio/entidades/Entrada';
import { DomainError } from '../../dominio/erros/ErroDeDominio';
import { ConsultaMatricula } from '../../dominio/integracoes/ConsultaMatricula';
import { RepositorioEntrada } from '../../dominio/repositorios/RepositorioEntrada';
import { Relogio } from '../portas/Relogio';
import { GeradorDeIds } from '../portas/GeradorDeIds';
import { CasoDeUso } from '../portas/CasoDeUso';

export interface RegisterCheckInInput {
  studentId: string;
}

export interface CheckInView {
  id: string;
  studentId: string;
  allowed: boolean;
  reason: string | null;
  occurredAt: string;
}

/**
 * Caso de uso: registrar uma tentativa de entrada na catraca.
 *
 * Consulta a matrícula no servico-alunos através da porta ConsultaMatricula
 * (Adapter na infraestrutura). Libera ou nega o acesso e registra a decisão.
 * Toda a comunicação entre serviços fica escondida atrás da abstração — o caso
 * de uso continua testável sem rede.
 */
export class RegisterCheckIn implements CasoDeUso<RegisterCheckInInput, CheckInView> {
  constructor(
    private readonly matriculas: ConsultaMatricula,
    private readonly entradas: RepositorioEntrada,
    private readonly geradorDeIds: GeradorDeIds,
    private readonly relogio: Relogio,
  ) {}

  async executar(dadosDaEntrada: RegisterCheckInInput): Promise<CheckInView> {
    const alunoId = (dadosDaEntrada.studentId ?? '').trim();
    if (alunoId.length === 0) {
      throw new DomainError('studentId é obrigatório');
    }

    const matricula = await this.matriculas.obterStatus(alunoId);
    const dataDaEntrada = this.relogio.agora();

    const registroDeEntrada = matricula.ativa
      ? CheckIn.allow({ id: this.geradorDeIds.gerar(), studentId: alunoId, occurredAt: dataDaEntrada })
      : CheckIn.deny({
          id: this.geradorDeIds.gerar(),
          studentId: alunoId,
          occurredAt: dataDaEntrada,
          reason: 'Aluno sem matrícula ativa',
        });

    await this.entradas.save(registroDeEntrada);

    return {
      id: registroDeEntrada.id,
      studentId: registroDeEntrada.studentId,
      allowed: registroDeEntrada.allowed,
      reason: registroDeEntrada.reason,
      occurredAt: registroDeEntrada.occurredAt.toISOString(),
    };
  }
}
