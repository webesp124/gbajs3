#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
APP_DIR="${REPO_ROOT}/gbajs3"
HOSTING_DIR="${REPO_ROOT}/netboy-github-pages"
NODE_VERSION="${NODE_VERSION:-20.19.0}"
COMMIT_MESSAGE="${1:-release latest netboy build}"

usage() {
  cat <<'EOF'
Usage: scripts/release-github-pages.sh [commit message]

Builds the netBOY app for GitHub Pages, copies dist/ into the
netboy-github-pages repo, and commits the generated release.

Environment:
  NODE_VERSION   Node version used through npx node@VERSION (default: 20.19.0)
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

require_dir() {
  local dir="$1"
  local label="$2"

  if [[ ! -d "${dir}" ]]; then
    echo "Missing ${label}: ${dir}" >&2
    exit 1
  fi
}

require_clean_hosting_repo() {
  if [[ -n "$(git -C "${HOSTING_DIR}" status --porcelain)" ]]; then
    echo "Hosting repo has uncommitted changes. Commit or discard them first:" >&2
    git -C "${HOSTING_DIR}" status --short >&2
    exit 1
  fi
}

require_dir "${APP_DIR}" "app directory"
require_dir "${HOSTING_DIR}/.git" "hosting git repository"
require_clean_hosting_repo

echo "Building netBOY for GitHub Pages..."
(
  cd "${APP_DIR}"
  npx -y "node@${NODE_VERSION}" ./node_modules/typescript/bin/tsc
  npx -y "node@${NODE_VERSION}" ./node_modules/vite/bin/vite.js build --mode with-coi-serviceworker
  cp dist/index.html dist/reader-setup.html
)

echo "Refreshing hosting repo..."
find "${HOSTING_DIR}" -mindepth 1 -maxdepth 1 \
  ! -name ".git" \
  ! -name ".nojekyll" \
  ! -name "README.md" \
  -exec rm -rf {} +

cp -a "${APP_DIR}/dist/." "${HOSTING_DIR}/"

echo "Staging release..."
git -C "${HOSTING_DIR}" add -A

if git -C "${HOSTING_DIR}" diff --cached --quiet; then
  echo "No generated changes to commit."
  exit 0
fi

echo "Committing release..."
git -C "${HOSTING_DIR}" commit -m "${COMMIT_MESSAGE}"

echo
echo "Release committed in ${HOSTING_DIR}:"
git -C "${HOSTING_DIR}" log --oneline -1
