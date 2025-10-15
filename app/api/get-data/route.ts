import { NextRequest, NextResponse } from 'next/server';
import { downloadFile, fileExists } from '@/lib/gcs';
import { convertExcelToJSON } from '@/lib/excel-to-json';
import { writeFile } from 'fs/promises';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    console.log('📥 Fetching dashboard data from Google Cloud Storage...');

    // The filename in GCS bucket that contains the dashboard data
    const gcsFilename = 'Dasbord Data Input 2.xlsx';

    // Check if file exists in GCS
    const exists = await fileExists(gcsFilename);

    if (!exists) {
      console.log('⚠️ No dashboard file found in Google Cloud Storage');
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على بيانات. يرجى رفع ملف Excel أولاً.',
        error: 'No data file found'
      }, { status: 404 });
    }

    // Download file from Google Cloud Storage
    const fileBuffer = await downloadFile(gcsFilename);
    console.log('☁️ File downloaded from Google Cloud Storage');

    // Save to temp file for processing
    const tempDir = '/tmp';
    const tempFilePath = path.join(tempDir, `download-${Date.now()}.xlsx`);
    await writeFile(tempFilePath, fileBuffer);
    console.log('💾 File saved temporarily for processing');

    try {
      // Convert Excel to JSON
      const dashboardData = await convertExcelToJSON(tempFilePath);

      console.log('✅ Dashboard data fetched successfully');
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
        message: 'تم جلب البيانات بنجاح',
        data: dashboardData,
        lastUpdated: new Date().toISOString()
      });

    } catch (processingError) {
      // Clean up temp file in case of error
      try {
        await fs.unlink(tempFilePath);
      } catch {}

      console.error('❌ Error processing Excel file:', processingError);
      return NextResponse.json({
        success: false,
        message: 'فشل في معالجة ملف Excel',
        error: processingError instanceof Error ? processingError.message : 'Unknown error'
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Error fetching data from GCS:', error);
    return NextResponse.json({
      success: false,
      message: 'فشل في جلب البيانات من التخزين السحابي',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
