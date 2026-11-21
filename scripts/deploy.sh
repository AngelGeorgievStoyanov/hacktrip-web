#!/usr/bin/env bash
set -Eeuo pipefail

APP_NAME="hacktrip-web"
EXPECTED_BRANCH="master"
HEALTHCHECK_URL="http://127.0.0.1:3000/"

log() {
  printf '\n[deploy] %s\n' "$1"
}

fail() {
  printf '\n[deploy] ERROR: %s\n' "$1" >&2
  exit 1
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

command -v git >/dev/null 2>&1 || fail "Git is not installed."
command -v npm >/dev/null 2>&1 || fail "npm is not installed."
command -v pm2 >/dev/null 2>&1 || fail "PM2 is not installed."
command -v curl >/dev/null 2>&1 || fail "curl is not installed."

CURRENT_BRANCH="$(git branch --show-current)"
[[ "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]] || fail "Deployment is allowed only from '$EXPECTED_BRANCH' (current: '$CURRENT_BRANCH')."

if [[ -n "$(git status --porcelain)" ]]; then
  git status --short
  fail "Working tree is not clean. Commit or discard local changes before deployment."
fi

log "Pulling the latest origin/$EXPECTED_BRANCH..."
git pull --ff-only origin "$EXPECTED_BRANCH"

if [[ "${INSTALL_DEPS:-0}" == "1" ]]; then
  log "Installing exact dependencies from package-lock.json..."
  npm ci --include=dev
else
  log "Skipping dependency installation (use npm run deploy:install when dependencies change)."
fi

log "Building the production application..."
npm run build

log "Starting or restarting PM2 process '$APP_NAME'..."
if pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  pm2 restart "$APP_NAME" --update-env
else
  pm2 start npm --name "$APP_NAME" -- start
fi

pm2 save

log "Checking local Next.js response..."
for attempt in {1..15}; do
  if curl --fail --silent --show-error --max-time 5 "$HEALTHCHECK_URL" -o /dev/null; then
    log "Deployment successful. $APP_NAME is responding on port 3000."
    pm2 status "$APP_NAME"
    exit 0
  fi
  sleep 2
done

pm2 logs "$APP_NAME" --lines 60 --nostream || true
fail "The application did not respond successfully at $HEALTHCHECK_URL."
