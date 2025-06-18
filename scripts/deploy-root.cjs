const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const apps = ['base', 'owner', 'tenant', 'admin'];

console.log('🚀 Deploying all PgPaal apps to Vercel...\n');

// Store the root directory
const rootDir = process.cwd();

// First build all apps
console.log('📦 Building all apps...');
try {
    execSync('npm run build:all', { stdio: 'inherit' });
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}

// Deploy each app from root directory with different configs
apps.forEach((app, index) => {
    console.log(`\n🌐 Deploying ${app} app (${index + 1}/${apps.length})...`);

    const distPath = path.join(rootDir, `dist-${app}`);
    const vercelConfigPath = path.join(rootDir, `vercel-${app}.json`);

    if (!fs.existsSync(distPath)) {
        console.error(`❌ dist-${app} folder not found!`);
        process.exit(1);
    }

    if (!fs.existsSync(vercelConfigPath)) {
        console.error(`❌ vercel-${app}.json not found!`);
        process.exit(1);
    }

    try {
        // Deploy from root directory using specific config
        console.log(`   📄 Using config: vercel-${app}.json`);
        console.log(`   📁 Deploying from: dist-${app}/`);

        execSync(`vercel --prod --yes -A vercel-${app}.json`, {
            stdio: 'inherit',
            cwd: rootDir
        });

        console.log(`✅ ${app} app deployed successfully!`);
    } catch (error) {
        console.error(`❌ Failed to deploy ${app} app:`, error.message);
        console.error(`Command: vercel --prod --yes -A vercel-${app}.json`);
        console.error(`Working directory: ${rootDir}`);
    }
});

console.log('\n🎉 All apps deployed successfully!');
console.log('\n🔗 Add these custom domains in Vercel dashboard:');
console.log('  pgpaal-base   -> www.purple-pgs.space');
console.log('  pgpaal-owner  -> owner.purple-pgs.space');
console.log('  pgpaal-tenant -> tenant.purple-pgs.space');
console.log('  pgpaal-admin  -> admin.purple-pgs.space');