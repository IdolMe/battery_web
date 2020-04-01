#!/usr/bin/env bash
#/bin/sh
set -e

echo "node version"
node -v
npm install node-sass --unsafe-perm --save-dev
npm install --unsafe-perm=true --allow-root
NODE_ENV=production npm run build
