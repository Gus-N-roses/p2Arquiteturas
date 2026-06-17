import { DecoradorLogCasoDeUso } from '../aplicacao/decoradores/DecoradorLogCasoDeUso';
import { CasoDeUso } from '../aplicacao/portas/CasoDeUso';
import {
  CreateInvoice,
  CreateInvoiceInput,
  InvoiceView,
} from '../aplicacao/casos-de-uso/EmitirFatura';
import {
  ListInvoices,
  ListStudentInvoices,
  ListStudentInvoicesInput,
} from '../aplicacao/casos-de-uso/ListarFaturas';
import { PayInvoice, PayInvoiceInput, PaymentReceipt } from '../aplicacao/casos-de-uso/PagarFatura';
import { FaturaPaga } from '../dominio/eventos/FaturaPaga';
import { NoLateFee, StandardLateFee } from '../dominio/precificacao/EstrategiaMultaAtraso';
import { BarramentoEventosEmMemoria } from '../infraestrutura/eventos/BarramentoEventosEmMemoria';
import { ManipuladorRegistrarRecibo } from '../infraestrutura/eventos/manipuladores/ManipuladorRegistrarRecibo';
import { GeradorUuid } from '../infraestrutura/identificadores/GeradorUuid';
import { RegistradorConsole } from '../infraestrutura/logs/RegistradorConsole';
import { InMemoryRepositorioFatura } from '../infraestrutura/repositorios/RepositorioFaturaEmMemoria';
import { RelogioSistema } from '../infraestrutura/tempo/RelogioSistema';

/**
 * COMPOSITION ROOT (Factory + Singleton). Único ponto que conhece as classes
 * concretas e injeta as dependências. A política de multa é escolhida aqui:
 * trocar StandardLateFee por NoLateFee é uma linha, sem tocar no caso de uso.
 */
export class Container {
  private static instance: Container | null = null;

  readonly emitirFatura: CasoDeUso<CreateInvoiceInput, InvoiceView>;
  readonly pagarFatura: CasoDeUso<PayInvoiceInput, PaymentReceipt>;
  readonly listarFaturas: CasoDeUso<void, InvoiceView[]>;
  readonly listarFaturasDoAluno: CasoDeUso<ListStudentInvoicesInput, InvoiceView[]>;

  private constructor() {
    const registrador = new RegistradorConsole();
    const geradorDeIds = new GeradorUuid();
    const relogio = new RelogioSistema();
    const faturas = new InMemoryRepositorioFatura();

    const politicaConfigurada = process.env.POLITICA_MULTA;
    const politicaDeMulta = politicaConfigurada === 'SEM_MULTA' ? new NoLateFee() : new StandardLateFee();

    const barramentoDeEventos = new BarramentoEventosEmMemoria(registrador);
    barramentoDeEventos.assinar(new FaturaPaga('', '', 0).name, new ManipuladorRegistrarRecibo(registrador));

    this.emitirFatura = new DecoradorLogCasoDeUso(
      'CreateInvoice',
      new CreateInvoice(faturas, geradorDeIds),
      registrador,
    );
    this.pagarFatura = new DecoradorLogCasoDeUso(
      'PayInvoice',
      new PayInvoice(faturas, politicaDeMulta, barramentoDeEventos, relogio),
      registrador,
    );
    this.listarFaturas = new DecoradorLogCasoDeUso(
      'ListInvoices',
      new ListInvoices(faturas),
      registrador,
    );
    this.listarFaturasDoAluno = new DecoradorLogCasoDeUso(
      'ListStudentInvoices',
      new ListStudentInvoices(faturas),
      registrador,
    );
  }

  static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}
