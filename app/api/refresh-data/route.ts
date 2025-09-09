import { NextRequest, NextResponse } from 'next/server';
import { updateDashboardData } from '@/lib/excel-to-json';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Data refresh request received...');
    
    // Define file paths
    const excelFilePath = 'C:\\Users\\mo_fa\\Downloads\\Weqaa Dashboard project\\Dasbord Data Input.xlsx';
    const jsonOutputPath = path.join(process.cwd(), 'data', 'dashboard_data.json');
    
    console.log('📂 Excel file path:', excelFilePath);
    console.log('📂 JSON output path:', jsonOutputPath);
    
    // Convert Excel to JSON and update the dashboard data
    await updateDashboardData(excelFilePath, jsonOutputPath);
    
    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error refreshing data:', error);
    
    return NextResponse.json({
      success: false,
      message: 'فشل في تحديث البيانات',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'استخدم POST لتحديث البيانات',
    endpoint: '/api/refresh-data',
    method: 'POST'
  });
}