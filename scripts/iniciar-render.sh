#!/usr/bin/env sh
set -eu

PORTA_PORTAL="${PORT:-3000}"
PORTA_ALUNOS="${PORTA_ALUNOS:-3001}"
PORTA_FINANCEIRO="${PORTA_FINANCEIRO:-3002}"
PORTA_ACESSO="${PORTA_ACESSO:-3003}"

export URL_SERVICO_ALUNOS="http://127.0.0.1:${PORTA_ALUNOS}"
export URL_SERVICO_FINANCEIRO="http://127.0.0.1:${PORTA_FINANCEIRO}"
export URL_SERVICO_ACESSO="http://127.0.0.1:${PORTA_ACESSO}"

encerrar() {
  kill "$PID_ALUNOS" "$PID_FINANCEIRO" "$PID_ACESSO" "$PID_PORTAL" 2>/dev/null || true
}
trap encerrar INT TERM EXIT

PORT="$PORTA_ALUNOS" node servicos/servico-alunos/dist/principal.js &
PID_ALUNOS=$!

PORT="$PORTA_FINANCEIRO" node servicos/servico-financeiro/dist/principal.js &
PID_FINANCEIRO=$!

PORT="$PORTA_ACESSO" URL_SERVICO_ALUNOS="$URL_SERVICO_ALUNOS" \
  node servicos/servico-acesso/dist/principal.js &
PID_ACESSO=$!

PORT="$PORTA_PORTAL" \
  URL_SERVICO_ALUNOS="$URL_SERVICO_ALUNOS" \
  URL_SERVICO_FINANCEIRO="$URL_SERVICO_FINANCEIRO" \
  URL_SERVICO_ACESSO="$URL_SERVICO_ACESSO" \
  node servicos/portal/dist/principal.js &
PID_PORTAL=$!

wait "$PID_PORTAL"
