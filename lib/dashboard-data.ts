
import { DashboardData } from './types';

// Safe import with error handling
let dashboardDataRaw: any = {};
try {
  dashboardDataRaw = require('../data/dashboard_data.json');
} catch (error) {
  console.error('Failed to load dashboard data:', error);
  dashboardDataRaw = {
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

export const dashboardData: DashboardData = dashboardDataRaw as DashboardData;

export function getDashboardOverview() {
  return dashboardData.overview;
}

export function getPhases() {
  return dashboardData.phases;
}

export function getSupportActivities() {
  return dashboardData.support;
}

export function getRisksData() {
  return dashboardData.risks;
}

export function getTimelineData() {
  return dashboardData.timeline;
}

export function getAllActivities() {
  return dashboardData.phases?.flatMap(phase => phase.activities) || [];
}

export function getActivitiesByStatus(status: string) {
  const allActivities = getAllActivities();
  return allActivities?.filter(activity => activity.الحالة === status) || [];
}

export function getActivitiesByPhase(phaseName: string) {
  const phase = dashboardData.phases?.find(p => p.name === phaseName);
  return phase?.activities || [];
}

export function getRisksByStatus(status: string) {
  return dashboardData.risks.risks_list?.filter(risk => risk.الحالة === status) || [];
}

export function getRisksByType(type: string) {
  return dashboardData.risks.risks_list?.filter(risk => risk.النوع === type) || [];
}

export function getSupportActivitiesByMember(member: string) {
  return dashboardData.support.activities?.filter(
    activity => activity['المسؤول من الفريق'] === member
  ) || [];
}
