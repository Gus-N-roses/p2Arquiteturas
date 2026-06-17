#!/usr/bin/env bash
# Sobe os 4 microsserviços localmente (sem Docker), com build automático.
# Uso:
#   bash scripts/subir-dev.sh
#   PORTA_ALUNOS=3101 PORTA_FINANCEIRO=3102 PORTA_ACESSO=3103 PORTA_PORTAL=3100 bash scripts/subir-dev.sh
#
# Encerrar: Ctrl+C  (mata todos os serviços iniciados por este script)

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORTA_ALUNOS="${PORTA_ALUNOS:-3001}"
PORTA_FINANCEIRO="${PORTA_FINANCEIRO:-3002}"
PORTA_ACESSO="${PORTA_ACESSO:-3003}"
PORTA_PORTAL="${PORTA_PORTAL:-3000}"

for s in servico-alunos servico-financeiro servico-acesso portal; do
  cd "$ROOT/servicos/$s"
  [ -d node_modules ] || npm install >/dev/null 2>&1
  npm run build >/dev/null 2>&1
done
cd "$ROOT"

# encerra todos os filhos ao sair
trap 'kill 0' EXIT

PORT="$PORTA_ALUNOS" node servicos/servico-alunos/dist/principal.js &
PORT="$PORTA_FINANCEIRO" node servicos/servico-financeiro/dist/principal.js &
URL_SERVICO_ALUNOS="http://localhost:${PORTA_ALUNOS}" PORT="$PORTA_ACESSO" \
  node servicos/servico-acesso/dist/principal.js &
URL_SERVICO_ALUNOS="http://localhost:${PORTA_ALUNOS}" \
  URL_SERVICO_FINANCEIRO="http://localhost:${PORTA_FINANCEIRO}" \
  URL_SERVICO_ACESSO="http://localhost:${PORTA_ACESSO}" \
  PORT="$PORTA_PORTAL" node servicos/portal/dist/principal.js &

echo "Gym Control no ar - portal em http://localhost:${PORTA_PORTAL}"
echo "alunos=${PORTA_ALUNOS} financeiro=${PORTA_FINANCEIRO} acesso=${PORTA_ACESSO}"
wait
