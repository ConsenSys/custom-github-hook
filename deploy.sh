#!/bin/bash
set -e

# This script is meant to be run automatically
branch=master
source='/var/www/singular-rmg'



# Git checkout appropriate branch, pull latest code
cd $source
git checkout .
git checkout $branch
git pull origin $branch
cd -

# Run build
cd $source
grunt
cd -
