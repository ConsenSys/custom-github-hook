#!/bin/bash
set -e

# This script is meant to be run automatically
branch=${GIT_DEPLOY_BRANCH:-master}
remote=${GIT_DEPLOY_REPO:-deploy}
src=${GIT_DEPLOY_STAGING:-/staging}

# Git checkout appropriate branch, pull latest code
cd $src
git fetch
git checkout $branch
git reset --hard origin/$branch
git push -f $remote $branch
