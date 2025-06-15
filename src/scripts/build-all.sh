# scripts/build-all.sh
#!/bin/bash

echo "🏗️  Building all apps..."

# Build Owner App
echo "📦 Building Owner App..."
npm run build:owner
mv dist dist-owner

# Build Tenant App  
echo "📦 Building Tenant App..."
npm run build:tenant
mv dist dist-tenant

# Build Admin App
echo "📦 Building Admin App..."
npm run build:admin
mv dist dist-admin

echo "✅ All builds completed!"