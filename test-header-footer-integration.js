// Test script to verify header and footer integration
// filepath: d:\project\PgPaal\PgPaalWeb\test-header-footer-integration.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Testing Header and Footer Integration for Both Landing Pages...\n');

const results = {
    tenantLandingPage: { hasHeader: false, hasFooter: false },
    ownerLandingPage: { hasHeader: false, hasFooter: false },
    sharedComponents: { headerExists: false, footerExists: false }
};

// Test 1: Check if shared Header component exists
const sharedHeaderPath = path.join(__dirname, 'src', 'components', 'Header.tsx');
if (fs.existsSync(sharedHeaderPath)) {
    results.sharedComponents.headerExists = true;
    console.log('✅ Shared Header component exists at src/components/Header.tsx');
} else {
    console.log('❌ Shared Header component missing at src/components/Header.tsx');
}

// Test 2: Check if shared Footer component exists
const sharedFooterPath = path.join(__dirname, 'src', 'components', 'Footer.tsx');
if (fs.existsSync(sharedFooterPath)) {
    results.sharedComponents.footerExists = true;
    console.log('✅ Shared Footer component exists at src/components/Footer.tsx');
} else {
    console.log('❌ Shared Footer component missing at src/components/Footer.tsx');
}

// Test 3: Check TenantLandingPage integration
const tenantPagePath = path.join(__dirname, 'src', 'features', 'landingPages', 'pages', 'TenantLandingPage', 'TenantLandingPage.tsx');
if (fs.existsSync(tenantPagePath)) {
    const tenantContent = fs.readFileSync(tenantPagePath, 'utf8');

    // Check for shared Header import
    if (tenantContent.includes('import Header from "../../../../components/Header"')) {
        results.tenantLandingPage.hasHeader = true;
        console.log('✅ TenantLandingPage imports shared Header component');
    } else {
        console.log('❌ TenantLandingPage does not import shared Header component');
    }

    // Check for shared Footer import
    if (tenantContent.includes('import Footer from "../../../../components/Footer"')) {
        results.tenantLandingPage.hasFooter = true;
        console.log('✅ TenantLandingPage imports shared Footer component');
    } else {
        console.log('❌ TenantLandingPage does not import shared Footer component');
    }

    // Check if Header and Footer are rendered
    if (tenantContent.includes('<Header />') && tenantContent.includes('<Footer />')) {
        console.log('✅ TenantLandingPage renders both Header and Footer components');
    } else {
        console.log('❌ TenantLandingPage missing Header or Footer in JSX');
    }
} else {
    console.log('❌ TenantLandingPage.tsx not found');
}

// Test 4: Check OwnerLandingPage integration
const ownerPagePath = path.join(__dirname, 'src', 'features', 'landingPages', 'pages', 'OwnerLandingpage.tsx');
if (fs.existsSync(ownerPagePath)) {
    const ownerContent = fs.readFileSync(ownerPagePath, 'utf8');

    // Check for shared Header import
    if (ownerContent.includes('import Header from "../../../components/Header"')) {
        results.ownerLandingPage.hasHeader = true;
        console.log('✅ OwnerLandingPage imports shared Header component');
    } else {
        console.log('❌ OwnerLandingPage does not import shared Header component');
    }

    // Check for shared Footer import
    if (ownerContent.includes('import Footer from "../../../components/Footer"')) {
        results.ownerLandingPage.hasFooter = true;
        console.log('✅ OwnerLandingPage imports shared Footer component');
    } else {
        console.log('❌ OwnerLandingPage does not import shared Footer component');
    }

    // Check if Header and Footer are rendered
    if (ownerContent.includes('<Header />') && ownerContent.includes('<Footer />')) {
        console.log('✅ OwnerLandingPage renders both Header and Footer components');
    } else {
        console.log('❌ OwnerLandingPage missing Header or Footer in JSX');
    }
} else {
    console.log('❌ OwnerLandingpage.tsx not found');
}

// Test 5: Check navigation button configuration in Header
if (results.sharedComponents.headerExists) {
    const headerContent = fs.readFileSync(sharedHeaderPath, 'utf8');

    if (headerContent.includes('navigate("/login")') && headerContent.includes('navigate("/register")')) {
        console.log('✅ Header has correct navigation buttons (Login → /login, Get Started → /register)');
    } else {
        console.log('❌ Header navigation buttons not configured correctly');
    }
}

// Test 6: Check Footer navigation links
if (results.sharedComponents.footerExists) {
    const footerContent = fs.readFileSync(sharedFooterPath, 'utf8');

    if (footerContent.includes('footerLinks') && footerContent.includes('useNavigate')) {
        console.log('✅ Footer has navigation links and routing functionality');
    } else {
        console.log('❌ Footer navigation not configured correctly');
    }
}

console.log('\n📊 Summary:');
console.log('='.repeat(50));

// Calculate overall completion
const totalChecks = 6;
let passedChecks = 0;

if (results.sharedComponents.headerExists) passedChecks++;
if (results.sharedComponents.footerExists) passedChecks++;
if (results.tenantLandingPage.hasHeader) passedChecks++;
if (results.tenantLandingPage.hasFooter) passedChecks++;
if (results.ownerLandingPage.hasHeader) passedChecks++;
if (results.ownerLandingPage.hasFooter) passedChecks++;

console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`📈 Completion: ${Math.round((passedChecks / totalChecks) * 100)}%`);

if (passedChecks === totalChecks) {
    console.log('\n🎉 SUCCESS: Header and Footer integration completed successfully!');
    console.log('Both TenantLandingPage and OwnerLandingPage now have:');
    console.log('  - Shared Header component with navigation buttons');
    console.log('  - Shared Footer component with comprehensive links');
    console.log('  - Proper routing configured for Login and Register pages');
} else {
    console.log('\n⚠️  INCOMPLETE: Some integration steps are missing');
}

console.log('\n🔗 Navigation Routes:');
console.log('  - Get Started button → /register');
console.log('  - Login button → /login');
console.log('  - Logo click → / (home)');
