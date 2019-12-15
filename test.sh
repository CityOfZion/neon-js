#!/bin/bash -eo pipefail
FILES=$(git diff --name-only --diff-filter=bd $(git merge-base HEAD next) | grep '^packages/.*\.[tj]s$')
echo $FILES
exit 0
