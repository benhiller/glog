#!/usr/bin/env bash

rm -r dist
npm run build
mkdir publish
cp -r bin/ publish
cp -r dist/ publish
cp index.js publish
cp package-lock.json publish
cp package.json publish
npm publish ./publish
rm -r publish
