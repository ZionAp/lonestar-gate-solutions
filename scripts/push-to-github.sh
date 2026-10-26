#!/usr/bin/env bash
set -e

# Reusable script to push this repo to GitHub
# Usage:
#   ./scripts/push-to-github.sh                        # uses existing origin or default
#   ./scripts/push-to-github.sh <remote-url> <branch> # custom remote/branch
#   SSH: ./scripts/push-to-github.sh git@github.com:ZionAp/lonestar-gate-solutions.git
#   HTTPS+token: GITHUB_TOKEN=ghp_xxx ./scripts/push-to-github.sh https://github.com/...

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_DIR"

# Default remote/branch
DEFAULT_REMOTE="git@github.com:ZionAp/lonestar-gate-solutions.git"
REMOTE_URL="${1:-}"
BRANCH="${2:-main}"

# If no remote URL passed, use existing origin or default
if [ -z "$REMOTE_URL" ]; then
  if git remote get-url origin >/dev/null 2>&1; then
    REMOTE_URL="$(git remote get-url origin)"
  else
    REMOTE_URL="$DEFAULT_REMOTE"
  fi
fi

# Ensure git identity
if ! git config user.email >/dev/null 2>&1 || [ -z "$(git config user.email)" ]; then
  git config user.email "zionappliance@gmail.com"
fi
if ! git config user.name >/dev/null 2>&1 || [ -z "$(git config user.name)" ]; then
  git config user.name "ZionAp"
fi

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
  CURRENT_URL="$(git remote get-url origin)"
  if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
    git remote set-url origin "$REMOTE_URL"
    echo "Updated origin -> $REMOTE_URL"
  fi
else
  git remote add origin "$REMOTE_URL"
  echo "Added origin -> $REMOTE_URL"
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
  echo "(If auth fails, set GITHUB_TOKEN or use SSH)"
  git push -u origin "$BRANCH"
fi

echo "Done."
