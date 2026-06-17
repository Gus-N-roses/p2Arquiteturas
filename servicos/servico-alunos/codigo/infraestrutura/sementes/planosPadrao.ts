import { Plan } from '../../dominio/entidades/Plano';
import { Periodicity } from '../../dominio/entidades/Periodicidade';
import { Money } from '../../dominio/objetos-de-valor/Dinheiro';

/**
 * Catálogo inicial de planos da academia. Em um sistema real viria do banco;
 * aqui é semeado na subida para o ERP já nascer utilizável.
 */
export function defaultPlans(): Plan[] {
  return [
    new Plan('plan-monthly', 'Musculação Mensal', Money.fromReais(120), Periodicity.MONTHLY),
    new Plan('plan-quarterly', 'Musculação Trimestral', Money.fromReais(120), Periodicity.QUARTERLY),
    new Plan('plan-annual', 'Musculação Anual', Money.fromReais(120), Periodicity.ANNUAL),
  ];
}
