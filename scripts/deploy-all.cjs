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

// Deploy each app from its dist folder
apps.forEach((app, index) => {
    console.log(`\n🌐 Deploying ${app} app (${index + 1}/${apps.length})...`);

    const distPath = path.join(rootDir, `dist-${app}`);

    if (!fs.existsSync(distPath)) {
        console.error(`❌ dist-${app} folder not found!`);
        process.exit(1);
    }

    try {
        // Copy the appropriate vercel config to the dist folder
        const vercelConfigPath = path.join(rootDir, `vercel-${app}.json`);
        const distVercelPath = path.join(distPath, 'vercel.json');

        if (fs.existsSync(vercelConfigPath)) {
            fs.copyFileSync(vercelConfigPath, distVercelPath);
        } else {
            console.warn(`⚠️  vercel-${app}.json not found, using default config`);
        }

        // Change to the dist folder and deploy
        process.chdir(distPath);

        // Deploy with specific project name (without deprecated --name flag)
        execSync(`vercel --prod --yes`, {
            stdio: 'inherit'
        });

        console.log(`✅ ${app} app deployed successfully!`);
    } catch (error) {
        console.error(`❌ Failed to deploy ${app} app:`, error.message);
        console.error(`Error occurred in: ${process.cwd()}`);
    } finally {
        // Always change back to root directory
        process.chdir(rootDir);
    }
});

console.log('\n🎉 All apps deployed successfully!');
console.log('\n🔗 Add these custom domains in Vercel dashboard:');
console.log('  pgpaal-base   -> www.purple-pgs.space');
console.log('  pgpaal-owner  -> owner.purple-pgs.space');
console.log('  pgpaal-tenant -> tenant.purple-pgs.space');
console.log('  pgpaal-admin  -> admin.purple-pgs.space');
console.log('\n📋 Or use Vercel CLI to add domains:');
console.log('  vercel domains add www.purple-pgs.space pgpaal-base');
console.log('  vercel domains add owner.purple-pgs.space pgpaal-owner');
console.log('  vercel domains add tenant.purple-pgs.space pgpaal-tenant');
console.log('  vercel domains add admin.purple-pgs.space pgpaal-admin');