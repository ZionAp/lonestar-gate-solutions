#!/usr/bin/env bash
set -e

# Reusable script to push this repo to GitHub
# Usage:
#   ./scripts/push-to-github.sh                        # uses defaults
#   GITHUB_TOKEN=ghp_xxx ./scripts/push-to-github.sh   # uses token auth
#   ./scripts/push-to-github.sh git@github.com:... main # custom remote/branch

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

REMOTE_URL="${1:-https://github.com/ZionAp/lonestar-gate-solutions.git}"
BRANCH="${2:-main}"

# Ensure git identity
git config user.email >/dev/null 2>&1 || git config user.email "zionap@example.com"
git config user.name >/dev/null 2>&1 || git config user.name "ZionAp"

# Stage and commit any changes
git add -A
if ! git diff --cached --quiet; then
  MSG="Update: $(date '+%Y-%m-%d %H:%M:%S')"
  echo "Committing: $MSG"
  git commit -m "$MSG"
else
  echo "No staged changes to commit."
fi

# Set remote
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git branch -M "$BRANCH"

# Push
if [[ "$REMOTE_URL" == git@* ]]; then
  echo "Pushing via SSH to $REMOTE_URL ($BRANCH)"
  git push -u origin "$BRANCH"
elif [ -n "$GITHUB_TOKEN" ]; then
  echo "Pushing via HTTPS with token to $REMOTE_URL ($BRANCH)"
  PUSH_URL="$(echo "$REMOTE_URL" | sed "s|https://|https://${GITHUB_TOKEN}@|")"
  git push -u "$PUSH_URL" "$BRANCH"
else
  echo "Pushing via HTTPS to $REMOTE_URL ($BRANCH)"
  echo "(If auth fails, set GITHUB_TOKEN or switch to SSH)"
  git push -u origin "$BRANCH"
fi

echo "Done."
