
export interface DashboardOverview {
  total_activities: number;
  completed_activities: number;
  in_progress_activities: number;
  delayed_activities: number;
  not_started_activities: number;
  completion_percentage: number;
}

export interface Phase {
  name: string;
  total_activities: number;
  completed_activities: number;
  completion_percentage: number;
  activities: Activity[];
}

export interface Activity {
  المرحلة: string;
  'النشاط الرئيسي': string;
  'النشاط الفرعي': string;
  الحالة: string;
  'تاريخ البدء المخطط': string;
  'تاريخ الانتهاء المخطط': string;
}

export interface SupportActivity {
  'أعمال الدعم التشغيلي': string;
  'المسؤول من الفريق': string;
  الحالة: string;
  'تاريخ الانتهاء': string;
}

export interface Risk {
  'المخاطر والتحديات': string;
  النوع: string;
  الحالة: string;
  'آليات المعالجة': string | null;
}

export interface DashboardData {
  overview: DashboardOverview;
  phases: Phase[];
  support: {
    total_support: number;
    completed_support: number;
    in_progress_support: number;
    delayed_support: number;
    not_started_support: number;
    activities: SupportActivity[];
  };
  risks: {
    total_risks: number;
    active_risks: number;
    resolved_risks: number;
    risks_list: Risk[];
  };
  timeline: {
    time_progress_percentage: number;
    activity_progress_percentage: number;
    project_start: string;
    current_date: string;
  };
}

export type ActivityStatus = 'مكتمل' | 'قيد التنفيذ' | 'متأخر' | 'لم يبدأ';
export type RiskStatus = 'قائم' | 'منتهي';
export type RiskType = 'خطر' | 'تحدي';
