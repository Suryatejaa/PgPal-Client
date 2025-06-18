const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const apps = ['base', 'owner', 'tenant', 'admin'];

console.log('🏗️  Building all PgPaal apps...\n');

// Clean up any existing dist folders
console.log('🧹 Cleaning up existing builds...');
apps.forEach(app => {
  const appDistPath = path.join(process.cwd(), `dist-${app}`);
  if (fs.existsSync(appDistPath)) {
    fs.rmSync(appDistPath, { recursive: true });
    console.log(`   Removed dist-${app}`);
  }
});

// Also clean main dist folder
const mainDistPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(mainDistPath)) {
  fs.rmSync(mainDistPath, { recursive: true });
  console.log('   Removed dist');
}

console.log('');

apps.forEach((app, index) => {
  console.log(`📦 Building ${app.charAt(0).toUpperCase() + app.slice(1)} App (${index + 1}/${apps.length})...`);

  try {
    // Build the app
    execSync(`npm run build:${app}`, { stdio: 'inherit' });

    // Check if dist folder was created
    const distPath = path.join(process.cwd(), 'dist');
    const appDistPath = path.join(process.cwd(), `dist-${app}`);

    if (fs.existsSync(distPath)) {
      // Rename dist folder to app-specific folder
      fs.renameSync(distPath, appDistPath);

      // Add package.json to the dist folder for Vercel deployment
      const packageJson = {
        "name": `pgpaal-${app}`,
        "version": "1.0.0",
        "scripts": {
          "build": "echo 'Already built'",
          "start": "echo 'Static site deployed'"
        }
      };

      fs.writeFileSync(
        path.join(appDistPath, 'package.json'),
        JSON.stringify(packageJson, null, 2)
      );

      console.log(`✅ ${app} app built successfully -> dist-${app}`);
      console.log(`   📁 Build size: ${getBuildSize(appDistPath)}\n`);
    } else {
      throw new Error('dist folder not found after build');
    }
  } catch (error) {
    console.error(`❌ Failed to build ${app} app:`, error.message);
    process.exit(1);
  }
});

function getBuildSize(dirPath) {
  try {
    const files = fs.readdirSync(dirPath, { recursive: true });
    const totalSize = files.reduce((acc, file) => {
      try {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        return acc + (stats.isFile() ? stats.size : 0);
      } catch {
        return acc;
      }
    }, 0);

    // Convert bytes to human readable format
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(totalSize) / Math.log(1024));
    return `${(totalSize / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  } catch {
    return 'Unknown';
  }
}

console.log('🎉 All apps built successfully!');
console.log('\n📁 Build output:');
apps.forEach(app => {
  console.log(`  📦 dist-${app}/ -> Ready for deployment as pgpaal-${app}`);
});

console.log('\n🚀 To deploy all apps, run: npm run deploy:all');