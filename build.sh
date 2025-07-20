#!/usr/bin/env bash
echo "🔧 Installing with legacy peer deps..."
npm install --legacy-peer-deps

echo "🏗️  Building the app..."
npm run build
