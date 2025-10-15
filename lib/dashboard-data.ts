
import { DashboardData } from './types';

// Safe import with error handling for static data
let staticDashboardData: any = {};
try {
  staticDashboardData = require('../data/dashboard_data.json');
} catch (error) {
  console.error('Failed to load static dashboard data:', error);
  staticDashboardData = {
    overview: {
      total_activities: 0,
      completed_activities: 0,
      in_progress_activities: 0,
      delayed_activities: 0,
      not_started_activities: 0,
      completion_percentage: 0
    },
    phases: [],
    support: { activities: [], completed_support: 0, total_support: 0 },
    risks: { risks_list: [], active_risks: 0, resolved_risks: 0, total_risks: 0 },
    timeline: { time_progress_percentage: 0, activity_progress_percentage: 0 }
  };
}

// Cache for dashboard data fetched from API
let cachedDashboardData: DashboardData | null = null;

// Function to fetch dashboard data from Google Cloud Storage via API
export async function fetchDashboardDataFromAPI(): Promise<DashboardData | null> {
  try {
    const response = await fetch('/api/get-data');
    const result = await response.json();

    if (result.success && result.data) {
      console.log('✅ Dashboard data fetched from Google Cloud Storage');
      cachedDashboardData = result.data as DashboardData;
      return result.data as DashboardData;
    } else {
      console.warn('⚠️ No data found in Google Cloud Storage, using fallback');
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to fetch dashboard data from API:', error);
    return null;
  }
}

// Function to get the current dashboard data (checks cache, then API, then localStorage, then static)
function getCurrentDashboardData(): DashboardData {
  // First check if we have cached data from API
  if (cachedDashboardData) {
    return cachedDashboardData;
  }

  // Check if running in browser environment
  if (typeof window !== 'undefined') {
    try {
      const uploadedData = localStorage.getItem('uploadedDashboardData');
      if (uploadedData) {
        const parsedUploadedData = JSON.parse(uploadedData);
        // If we have uploaded data with dashboardData property, use it
        if (parsedUploadedData.dashboardData) {
          console.log('Using uploaded dashboard data from localStorage');
          return parsedUploadedData.dashboardData as DashboardData;
        }
      }
    } catch (error) {
      console.error('Failed to load uploaded data from localStorage:', error);
    }
  }

  // Fall back to static data
  return staticDashboardData as DashboardData;
}

// Dynamic getters that always use the latest data
export function getDashboardOverview() {
  const currentData = getCurrentDashboardData();
  return currentData.overview;
}

export function getPhases() {
  const currentData = getCurrentDashboardData();
  return currentData.phases;
}

export function getSupportActivities() {
  const currentData = getCurrentDashboardData();
  return currentData.support;
}

export function getRisksData() {
  const currentData = getCurrentDashboardData();
  return currentData.risks;
}

export function getTimelineData() {
  const currentData = getCurrentDashboardData();
  return currentData.timeline;
}

export function getAllActivities() {
  const currentData = getCurrentDashboardData();
  return currentData.phases?.flatMap(phase => phase.activities) || [];
}

export function getActivitiesByStatus(status: string) {
  const allActivities = getAllActivities();
  return allActivities?.filter(activity => activity.الحالة === status) || [];
}

export function getActivitiesByPhase(phaseName: string) {
  const currentData = getCurrentDashboardData();
  const phase = currentData.phases?.find(p => p.name === phaseName);
  return phase?.activities || [];
}

export function getRisksByStatus(status: string) {
  const currentData = getCurrentDashboardData();
  return currentData.risks.risks_list?.filter(risk => risk.الحالة === status) || [];
}

export function getRisksByType(type: string) {
  const currentData = getCurrentDashboardData();
  return currentData.risks.risks_list?.filter(risk => risk.النوع === type) || [];
}

export function getSupportActivitiesByMember(member: string) {
  const currentData = getCurrentDashboardData();
  return currentData.support.activities?.filter(
    activity => activity['المسؤول من الفريق'] === member
  ) || [];
}

// Legacy export for backwards compatibility
export const dashboardData: DashboardData = getCurrentDashboardData();
