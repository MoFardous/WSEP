import { NextRequest, NextResponse } from 'next/server';
import { convertExcelToJSON } from '@/lib/excel-to-json';
import { promises as fs } from 'fs';
import path from 'path';
import { writeFile } from 'fs/promises';

export async function POST(request: NextRequest) {
  try {
    console.log('📤 File upload request received...');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على ملف'
      }, { status: 400 });
    }

    // Validate file type
    if (!file.name.endsWith('.xlsx')) {
      return NextResponse.json({
        success: false,
        message: 'نوع الملف غير مدعوم. يرجى رفع ملف Excel بامتداد .xlsx'
      }, { status: 400 });
    }

    console.log('📁 Processing file:', file.name, '(', file.size, 'bytes)');

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    try {
      await fs.access(tempDir);
    } catch {
      await fs.mkdir(tempDir, { recursive: true });
    }

    // Save uploaded file temporarily
    const tempFilePath = path.join(tempDir, `upload-${Date.now()}.xlsx`);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(tempFilePath, buffer);
    console.log('💾 File saved temporarily at:', tempFilePath);

    try {
      // Convert Excel to JSON using our existing function
      const dashboardData = await convertExcelToJSON(tempFilePath);
      
      // Save the JSON data to the dashboard data file
      const jsonOutputPath = path.join(process.cwd(), 'data', 'dashboard_data.json');
      const jsonString = JSON.stringify(dashboardData, null, 2);
      await writeFile(jsonOutputPath, jsonString, 'utf8');
      
      console.log('✅ Dashboard data updated successfully');
      console.log('📊 Statistics:');
      console.log(`   - Total activities: ${dashboardData.overview.total_activities}`);
      console.log(`   - Completed: ${dashboardData.overview.completed_activities}`);
      console.log(`   - Completion: ${dashboardData.overview.completion_percentage}%`);
      console.log(`   - Phases: ${dashboardData.phases.length}`);
      console.log(`   - Support activities: ${dashboardData.support.total_support}`);
      console.log(`   - Risks: ${dashboardData.risks.total_risks}`);

      // Clean up temp file
      await fs.unlink(tempFilePath);
      console.log('🧹 Temporary file cleaned up');

      return NextResponse.json({
        success: true,
        message: 'تم تحديث البيانات بنجاح',
        data: {
          totalActivities: dashboardData.overview.total_activities,
          completedActivities: dashboardData.overview.completed_activities,
          completionPercentage: dashboardData.overview.completion_percentage,
          totalPhases: dashboardData.phases.length,
          totalSupport: dashboardData.support.total_support,
          totalRisks: dashboardData.risks.total_risks,
          fileName: file.name,
          fileSize: file.size,
          uploadTime: new Date().toISOString()
        }
      });

    } catch (processingError) {
      // Clean up temp file in case of error
      try {
        await fs.unlink(tempFilePath);
      } catch {}
      
      console.error('❌ Error processing Excel file:', processingError);
      return NextResponse.json({
        success: false,
        message: 'فشل في معالجة ملف Excel. تأكد من صحة تنسيق الملف والأوراق المطلوبة.',
        error: processingError instanceof Error ? processingError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Upload error:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في رفع الملف',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'استخدم POST لرفع ملف Excel',
    endpoint: '/api/upload-excel',
    method: 'POST',
    acceptedTypes: ['.xlsx'],
    maxSize: '10MB'
  });
}