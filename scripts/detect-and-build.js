const { execSync } = require('child_process');

// Detect app type from Vercel environment or default to owner
const getAppType = () => {
    const domain = process.env.VERCEL_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || '';

    if (domain.includes('tenant')) return 'tenant';
    if (domain.includes('admin')) return 'admin';
    return 'owner'; // default
};

const appType = getAppType();
console.log(`🚀 Building ${appType} app for Vercel deployment...`);

try {
    execSync(`npm run build:${appType}`, { stdio: 'inherit' });
    console.log(`✅ ${appType} app built successfully!`);
} catch (error) {
    console.error(`❌ Failed to build ${appType} app:`, error.message);
    process.exit(1);
}