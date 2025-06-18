const { execSync } = require('child_process');

const detectAppType = () => {
    // Check Vercel environment variables
    const vercelUrl = process.env.VERCEL_URL || '';
    const projectName = process.env.VERCEL_PROJECT_PRODUCTION_URL || '';
    const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';

    console.log('🔍 Detection Info:');
    console.log('  VERCEL_URL:', vercelUrl);
    console.log('  PROJECT_URL:', projectName);
    console.log('  BRANCH:', branch);

    // Detect based on URL or branch
    if (vercelUrl.includes('tenant') || projectName.includes('tenant') || branch.includes('tenant')) {
        return 'tenant';
    }
    if (vercelUrl.includes('admin') || projectName.includes('admin') || branch.includes('admin')) {
        return 'admin';
    }

    // Default to owner
    return 'owner';
};

const appType = detectAppType();
console.log(`🚀 Building ${appType} app for Vercel...`);

try {
    // Set environment variable for build
    process.env.VITE_APP_TYPE = appType;

    // Build the specific app
    execSync(`npm run build:${appType}`, { stdio: 'inherit' });
    console.log(`✅ ${appType} app built successfully!`);
} catch (error) {
    console.error(`❌ Failed to build ${appType} app:`, error.message);
    process.exit(1);
}