
import { DashboardData } from './types';
import dashboardDataRaw from '../data/dashboard_data.json';

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
