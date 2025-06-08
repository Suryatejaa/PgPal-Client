// Test script to verify header and footer components
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const componentsDir = 'd:/project/PgPaal/PgPaalWeb/src/features/landingPages/pages/TenantLandingPage/components';

console.log('🔍 Verifying Header and Footer Components...\n');

// Check if all components exist
const expectedComponents = [
    'Header.tsx',
    'Footer.tsx',
    'HeroSection.tsx',
    'SearchResultsSection.tsx',
    'PGDetailsModal.tsx',
    'PopularCitiesSection.tsx',
    'WhyChooseUsSection.tsx',
    'TestimonialsSection.tsx',
    'FeaturedPGsSection.tsx',
    'HowItWorksSection.tsx',
    'CTASection.tsx'
];

let allComponentsExist = true;

expectedComponents.forEach(component => {
    const componentPath = join(componentsDir, component);
    if (existsSync(componentPath)) {
        console.log(`✅ ${component} - Found`);
    } else {
        console.log(`❌ ${component} - Missing`);
        allComponentsExist = false;
    }
});

console.log('\n📋 Summary:');
console.log(`Total Components: ${expectedComponents.length}`);
console.log(`Status: ${allComponentsExist ? '✅ All components found' : '❌ Some components missing'}`);

// Check if main TenantLandingPage imports the new components
const mainComponentPath = 'd:/project/PgPaal/PgPaalWeb/src/features/landingPages/pages/TenantLandingPage/TenantLandingPage.tsx';

if (existsSync(mainComponentPath)) {
    const content = readFileSync(mainComponentPath, 'utf8');

    console.log('\n🔧 Checking TenantLandingPage imports:');

    const hasHeaderImport = content.includes('import Header from "./components/Header"');
    const hasFooterImport = content.includes('import Footer from "./components/Footer"');
    const hasHeaderInJSX = content.includes('<Header />');
    const hasFooterInJSX = content.includes('<Footer />');

    console.log(`Header Import: ${hasHeaderImport ? '✅' : '❌'}`);
    console.log(`Footer Import: ${hasFooterImport ? '✅' : '❌'}`);
    console.log(`Header in JSX: ${hasHeaderInJSX ? '✅' : '❌'}`);
    console.log(`Footer in JSX: ${hasFooterInJSX ? '✅' : '❌'}`);

    const allHeaderFooterChecks = hasHeaderImport && hasFooterImport && hasHeaderInJSX && hasFooterInJSX;
    console.log(`\n📦 Header & Footer Integration: ${allHeaderFooterChecks ? '✅ Complete' : '❌ Incomplete'}`);
} else {
    console.log('\n❌ Main TenantLandingPage component not found');
}

console.log('\n🎯 Header and Footer Verification Complete!');
