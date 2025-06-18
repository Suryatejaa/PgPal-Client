const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apps = ['owner', 'tenant', 'admin'];

console.log('🏗️  Building all PgPaal apps for Vercel deployment...\n');

apps.forEach((app, index) => {
  console.log(`📦 Building ${app.charAt(0).toUpperCase() + app.slice(1)} App (${index + 1}/${apps.length})...`);

  try {
    // Build the app
    execSync(`npm run build:${app}`, { stdio: 'inherit' });

    // Rename dist folder
    const distPath = path.join(process.cwd(), 'dist');
    const appDistPath = path.join(process.cwd(), `dist-${app}`);

    if (fs.existsSync(distPath)) {
      if (fs.existsSync(appDistPath)) {
        fs.rmSync(appDistPath, { recursive: true });
      }
      fs.renameSync(distPath, appDistPath);
      console.log(`✅ ${app} app built successfully -> dist-${app}\n`);
    }
  } catch (error) {
    console.error(`❌ Failed to build ${app} app:`, error.message);
    process.exit(1);
  }
});

console.log('🎉 All apps built successfully!');
console.log('\nReady for Vercel deployment:');
apps.forEach(app => {
  console.log(`  📁 dist-${app}/ -> vercel-${app}.json -> ${app}.purple-pgs.space`);
});
console.log('\nDeploy commands:');
console.log('  npm run deploy:owner');
console.log('  npm run deploy:tenant');
console.log('  npm run deploy:admin');
console.log('  npm run deploy:all');