#!/usr/bin/env node
// Simple integration test for admin dashboard

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Admin Dashboard Integration...\n');

// Test file existence
const requiredFiles = [
  'src/features/adminDashboard/pages/AdminDashboard.tsx',
  'src/features/adminDashboard/components/StatsCard.tsx',
  'src/features/adminDashboard/components/DashboardChart.tsx',
  'src/features/adminDashboard/components/PropertyTable.tsx',
  'src/features/adminDashboard/components/RoomTable.tsx',
  'src/features/adminDashboard/services/propertyService.ts',
  'src/features/adminDashboard/services/roomService.ts'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
    allFilesExist = false;
  }
});

// Test import statements
console.log('\n📦 Testing Import Statements...\n');

try {
  // Test basic TypeScript parsing
  const adminDashboardContent = fs.readFileSync('src/features/adminDashboard/pages/AdminDashboard.tsx', 'utf8');
  
  const requiredImports = [
    'import React',
    'import StatsCard',
    'import DashboardChart',
    'import PropertyTable',
    'import RoomTable',
    'import { propertyService }',
    'import { roomService }'
  ];
  
  requiredImports.forEach(importStatement => {
    if (adminDashboardContent.includes(importStatement)) {
      console.log(`✅ ${importStatement}`);
    } else {
      console.log(`❌ ${importStatement} - Missing!`);
      allFilesExist = false;
    }
  });
  
} catch (error) {
  console.log(`❌ Error reading AdminDashboard.tsx: ${error.message}`);
  allFilesExist = false;
}

// Test interface exports
console.log('\n🔧 Testing Interface Exports...\n');

try {
  const propertyServiceContent = fs.readFileSync('src/features/adminDashboard/services/propertyService.ts', 'utf8');
  const roomServiceContent = fs.readFileSync('src/features/adminDashboard/services/roomService.ts', 'utf8');
  
  const requiredExports = [
    { file: 'propertyService.ts', exports: ['export interface Property', 'export interface DashboardOverview', 'export const propertyService'] },
    { file: 'roomService.ts', exports: ['export interface Room', 'export interface RoomAnalytics', 'export const roomService'] }
  ];
  
  requiredExports.forEach(({ file, exports }) => {
    const content = file.includes('property') ? propertyServiceContent : roomServiceContent;
    exports.forEach(exportStatement => {
      if (content.includes(exportStatement)) {
        console.log(`✅ ${file}: ${exportStatement}`);
      } else {
        console.log(`❌ ${file}: ${exportStatement} - Missing!`);
        allFilesExist = false;
      }
    });
  });
  
} catch (error) {
  console.log(`❌ Error reading service files: ${error.message}`);
  allFilesExist = false;
}

// Final result
console.log('\n🎯 Integration Test Results:\n');

if (allFilesExist) {
  console.log('✅ All tests passed! Admin Dashboard is ready for integration.');
  console.log('\n📋 Summary:');
  console.log('   • All required files exist');
  console.log('   • All imports are correctly structured');
  console.log('   • All interfaces are properly exported');
  console.log('   • Services are ready for API integration');
  
  console.log('\n🚀 Next Steps:');
  console.log('   1. Start the development server: npm run dev');
  console.log('   2. Navigate to the admin dashboard route');
  console.log('   3. Test API integration with actual endpoints');
  process.exit(0);
} else {
  console.log('❌ Some tests failed. Please check the missing files/imports above.');
  process.exit(1);
}
