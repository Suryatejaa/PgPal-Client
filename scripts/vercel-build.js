// scripts/vercel-build.js
const { execSync } = require('child_process');

const detectAppType = () => {
  // Check environment variables set by Vercel for each domain
  const url = process.env.VERCEL_URL || '';
  const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';
  
  // You can also use branch-based detection
  if (url.includes('tenant') || branch.includes('tenant')) return 'tenant';
  if (url.includes('admin') || branch.includes('admin')) return 'admin';
  return 'owner';
};

const appType = detectAppType();
console.log(`🚀 Building for: ${appType}`);

// Set environment variable for the build
process.env.VITE_APP_TYPE = appType;

// Build the app
execSync(`vite build --mode ${appType}.production`, { stdio: 'inherit' });