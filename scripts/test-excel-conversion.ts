#!/usr/bin/env tsx

import { updateDashboardData } from '../lib/excel-to-json';
import path from 'path';

async function testConversion() {
  console.log('🧪 Testing Excel to JSON conversion...\n');
  
  try {
    const excelFilePath = 'C:\\Users\\mo_fa\\Downloads\\Weqaa Dashboard project\\Dasbord Data Input.xlsx';
    const jsonOutputPath = path.join(__dirname, '..', 'data', 'dashboard_data_updated.json');
    
    console.log('📂 Excel file path:', excelFilePath);
    console.log('📂 JSON output path:', jsonOutputPath);
    console.log('');
    
    await updateDashboardData(excelFilePath, jsonOutputPath);
    
    console.log('\n✅ Test completed successfully!');
    console.log('📁 Check the output file:', jsonOutputPath);
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testConversion();