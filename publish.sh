#!/usr/bin/env bash

rm -r dist
npm run build
mkdir publish
cp -R bin publish
cp -R dist publish
cp index.js publish
cp package-lock.json publish
cp package.json publish
npm publish ./publish
rm -r publish
