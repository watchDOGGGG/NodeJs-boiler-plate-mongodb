#!/bin/bash

# Run the commands
git checkout main --force
git branch -D dev --force
git fetch
git checkout dev --force
git pull origin dev --force
npm run build:qa
pm2 list