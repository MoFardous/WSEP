import * as XLSX from 'xlsx';
import { promises as fs } from 'fs';
import path from 'path';

export interface ExcelData {
  overview: {
    total_activities: number;
    completed_activities: number;
    in_progress_activities: number;
    delayed_activities: number;
    not_started_activities: number;
    completion_percentage: number;
  };
  phases: Array<{
    name: string;
    total_activities: number;
    completed_activities: number;
    completion_percentage: number;
    activities: Array<{
      المرحلة: string;
      'النشاط الرئيسي': string;
      'النشاط الفرعي': string;
      الحالة: string;
      'تاريخ البدء المخطط': string;
      'تاريخ الانتهاء المخطط': string;
    }>;
  }>;
  support: {
    total_support: number;
    completed_support: number;
    in_progress_support: number;
    delayed_support: number;
    not_started_support: number;
    activities: Array<{
      'أعمال الدعم التشغيلي': string;
      'المسؤول من الفريق': string;
      الحالة: string;
      'تاريخ الانتهاء': string;
    }>;
  };
  risks: {
    total_risks: number;
    active_risks: number;
    resolved_risks: number;
    risks_list: Array<{
      'المخاطر والتحديات': string;
      النوع: string;
      الحالة: string;
      'آليات المعالجة': string | null;
    }>;
  };
  timeline: {
    time_progress_percentage: number;
    activity_progress_percentage: number;
    project_start: string;
    current_date: string;
  };
}

export async function convertExcelToJSON(excelFilePath: string): Promise<ExcelData> {
  try {
    // Read the Excel file as buffer first, then parse
    const fs = await import('fs').then(m => m.promises);
    const fileBuffer = await fs.readFile(excelFilePath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetNames = workbook.SheetNames;
    
    console.log('📊 Reading Excel sheets:', sheetNames);

    // Initialize the data structure
    const data: ExcelData = {
      overview: {
        total_activities: 0,
        completed_activities: 0,
        in_progress_activities: 0,
        delayed_activities: 0,
        not_started_activities: 0,
        completion_percentage: 0
      },
      phases: [],
      support: {
        total_support: 0,
        completed_support: 0,
        in_progress_support: 0,
        delayed_support: 0,
        not_started_support: 0,
        activities: []
      },
      risks: {
        total_risks: 0,
        active_risks: 0,
        resolved_risks: 0,
        risks_list: []
      },
      timeline: {
        time_progress_percentage: 0,
        activity_progress_percentage: 0,
        project_start: new Date().toISOString().split('T')[0],
        current_date: new Date().toISOString().split('T')[0]
      }
    };

    // Process each sheet
    for (const sheetName of sheetNames) {
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];
      
      console.log(`📋 Processing sheet: ${sheetName} (${jsonData.length} rows)`);

      if (sheetName.toLowerCase().includes('activities') || sheetName.toLowerCase().includes('أنشطة')) {
        processActivitiesSheet(jsonData, data);
      } else if (sheetName.toLowerCase().includes('support') || sheetName.toLowerCase().includes('دعم')) {
        processSupportSheet(jsonData, data);
      } else if (sheetName.toLowerCase().includes('risks') || sheetName.toLowerCase().includes('مخاطر')) {
        processRisksSheet(jsonData, data);
      } else if (sheetName.toLowerCase().includes('timeline') || sheetName.toLowerCase().includes('جدول')) {
        processTimelineSheet(jsonData, data);
      }
    }

    // Calculate overview statistics
    calculateOverviewStats(data);

    return data;
  } catch (error) {
    console.error('❌ Error converting Excel to JSON:', error);
    throw error;
  }
}

function processActivitiesSheet(jsonData: any[][], data: ExcelData) {
  if (jsonData.length < 2) return;

  const headers = jsonData[0] as string[];
  const activities = jsonData.slice(1);

  // Group activities by phase
  const phaseGroups: { [key: string]: any[] } = {};

  activities.forEach(row => {
    if (!row || row.length === 0) return;

    const activity: any = {};
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        activity[header] = row[index];
      }
    });

    const phaseName = activity['المرحلة'] || activity['Phase'] || 'مرحلة غير محددة';
    if (!phaseGroups[phaseName]) {
      phaseGroups[phaseName] = [];
    }
    phaseGroups[phaseName].push(activity);
  });

  // Convert to phases array
  Object.keys(phaseGroups).forEach(phaseName => {
    const activities = phaseGroups[phaseName];
    const completedCount = activities.filter(a => 
      a.الحالة === 'مكتمل' || a.الحالة === 'completed'
    ).length;

    data.phases.push({
      name: phaseName,
      total_activities: activities.length,
      completed_activities: completedCount,
      completion_percentage: Math.round((completedCount / activities.length) * 100 * 100) / 100,
      activities: activities.map(a => ({
        المرحلة: a.المرحلة || a.Phase || phaseName,
        'النشاط الرئيسي': a['النشاط الرئيسي'] || a['Main Activity'] || '',
        'النشاط الفرعي': a['النشاط الفرعي'] || a['Sub Activity'] || '',
        الحالة: a.الحالة || a.Status || 'لم يبدأ',
        'تاريخ البدء المخطط': a['تاريخ البدء المخطط'] || a['Start Date'] || '',
        'تاريخ الانتهاء المخطط': a['تاريخ الانتهاء المخطط'] || a['End Date'] || ''
      }))
    });
  });
}

function processSupportSheet(jsonData: any[][], data: ExcelData) {
  if (jsonData.length < 2) return;

  const headers = jsonData[0] as string[];
  const activities = jsonData.slice(1);

  activities.forEach(row => {
    if (!row || row.length === 0) return;

    const activity: any = {};
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        activity[header] = row[index];
      }
    });

    data.support.activities.push({
      'أعمال الدعم التشغيلي': activity['أعمال الدعم التشغيلي'] || activity['Support Activity'] || '',
      'المسؤول من الفريق': activity['المسؤول من الفريق'] || activity['Team Member'] || '',
      الحالة: activity.الحالة || activity.Status || 'مكتمل',
      'تاريخ الانتهاء': activity['تاريخ الانتهاء'] || activity['Completion Date'] || ''
    });
  });

  // Calculate support statistics
  const completedSupport = data.support.activities.filter(a => 
    a.الحالة === 'مكتمل' || a.الحالة === 'completed'
  ).length;

  data.support.total_support = data.support.activities.length;
  data.support.completed_support = completedSupport;
  data.support.in_progress_support = data.support.activities.filter(a => 
    a.الحالة === 'قيد التنفيذ' || a.الحالة === 'in_progress'
  ).length;
}

function processRisksSheet(jsonData: any[][], data: ExcelData) {
  if (jsonData.length < 2) return;

  const headers = jsonData[0] as string[];
  const risks = jsonData.slice(1);

  risks.forEach(row => {
    if (!row || row.length === 0) return;

    const risk: any = {};
    headers.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        risk[header] = row[index];
      }
    });

    data.risks.risks_list.push({
      'المخاطر والتحديات': risk['المخاطر والتحديات'] || risk['Risk Description'] || '',
      النوع: risk.النوع || risk.Type || 'خطر',
      الحالة: risk.الحالة || risk.Status || 'منتهي',
      'آليات المعالجة': risk['آليات المعالجة'] || risk['Treatment'] || null
    });
  });

  // Calculate risk statistics
  data.risks.total_risks = data.risks.risks_list.length;
  data.risks.active_risks = data.risks.risks_list.filter(r => 
    r.الحالة === 'قائم' || r.الحالة === 'active'
  ).length;
  data.risks.resolved_risks = data.risks.risks_list.filter(r => 
    r.الحالة === 'منتهي' || r.الحالة === 'resolved'
  ).length;
}

function processTimelineSheet(jsonData: any[][], data: ExcelData) {
  // Try to extract timeline information from the data
  // This might need to be customized based on your Excel structure
  if (jsonData.length > 1) {
    const timelineData = jsonData[1];
    data.timeline.time_progress_percentage = parseFloat(timelineData[0]) || 0;
    data.timeline.activity_progress_percentage = parseFloat(timelineData[1]) || 0;
    data.timeline.project_start = timelineData[2] || new Date().toISOString().split('T')[0];
    data.timeline.current_date = timelineData[3] || new Date().toISOString().split('T')[0];
  }
}

function calculateOverviewStats(data: ExcelData) {
  const allActivities = data.phases.flatMap(phase => phase.activities);
  
  data.overview.total_activities = allActivities.length;
  data.overview.completed_activities = allActivities.filter(a => 
    a.الحالة === 'مكتمل' || a.الحالة === 'completed'
  ).length;
  data.overview.in_progress_activities = allActivities.filter(a => 
    a.الحالة === 'قيد التنفيذ' || a.الحالة === 'in_progress'
  ).length;
  data.overview.delayed_activities = allActivities.filter(a => 
    a.الحالة === 'متأخر' || a.الحالة === 'delayed'
  ).length;
  data.overview.not_started_activities = allActivities.filter(a => 
    a.الحالة === 'لم يبدأ' || a.الحالة === 'not_started'
  ).length;

  data.overview.completion_percentage = data.overview.total_activities > 0 
    ? Math.round((data.overview.completed_activities / data.overview.total_activities) * 100 * 100) / 100
    : 0;

  // Calculate time progress percentage based on 12-month project duration
  calculateTimeProgress(data, allActivities);

  // Set activities array for compatibility
  (data as any).activities = allActivities;
}

function calculateTimeProgress(data: ExcelData, allActivities: any[]) {
  try {
    // Fixed project dates
    const projectStartDate = new Date('2025-06-30'); // June 30, 2025
    const projectEndDate = new Date('2026-06-29');   // June 29, 2026
    const currentDate = new Date();
    
    // Calculate project duration and elapsed time
    const totalProjectDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, Math.ceil((currentDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    // Set timeline data
    data.timeline.project_start = projectStartDate.toISOString().split('T')[0];
    data.timeline.current_date = currentDate.toISOString().split('T')[0];
    
    // Calculate time progress percentage
    data.timeline.time_progress_percentage = Math.max(0, Math.min(100, 
      Math.round((elapsedDays / totalProjectDays) * 100 * 100) / 100
    ));
    
    // Activity progress percentage (already calculated)
    data.timeline.activity_progress_percentage = data.overview.completion_percentage;
    
    console.log(`📅 Timeline Calculation:
    - Project Start: ${data.timeline.project_start}
    - Project End: ${projectEndDate.toISOString().split('T')[0]}
    - Current Date: ${data.timeline.current_date}
    - Total Project Days: ${totalProjectDays}
    - Elapsed Days: ${elapsedDays}
    - Time Progress: ${data.timeline.time_progress_percentage}%
    - Activity Progress: ${data.timeline.activity_progress_percentage}%`);
    
  } catch (error) {
    console.error('❌ Error calculating time progress:', error);
    
    // Fallback values
    const currentDate = new Date();
    data.timeline.project_start = '2025-06-30';
    data.timeline.current_date = currentDate.toISOString().split('T')[0];
    data.timeline.time_progress_percentage = 0;
    data.timeline.activity_progress_percentage = data.overview.completion_percentage;
  }
}

export async function updateDashboardData(excelFilePath: string, outputPath: string): Promise<void> {
  try {
    console.log('🔄 Starting Excel to JSON conversion...');
    
    // Convert Excel to JSON
    const dashboardData = await convertExcelToJSON(excelFilePath);
    
    // Write to JSON file
    const jsonString = JSON.stringify(dashboardData, null, 2);
    await fs.writeFile(outputPath, jsonString, 'utf8');
    
    console.log('✅ Dashboard data updated successfully!');
    console.log(`📁 Output written to: ${outputPath}`);
    console.log(`📊 Total activities: ${dashboardData.overview.total_activities}`);
    console.log(`🎯 Completion: ${dashboardData.overview.completion_percentage}%`);
    
  } catch (error) {
    console.error('❌ Error updating dashboard data:', error);
    throw error;
  }
}