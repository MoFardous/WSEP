
"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Upload
} from 'lucide-react';
import { KPICard } from '@/components/dashboard/kpi-card';
import { PhaseCard } from '@/components/dashboard/phase-card';
import { ProgressChart } from '@/components/charts/progress-chart';
import { TimelineComparison } from '@/components/charts/timeline-comparison';
import { PhaseProgress } from '@/components/charts/phase-progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshButton, DataSyncIndicator } from '@/components/ui/refresh-button';
import Link from 'next/link';
import { getDashboardOverview, getPhases, getSupportActivities, getRisksData, getTimelineData, fetchDashboardDataFromAPI } from '@/lib/dashboard-data';
import { Phase, SupportActivity, Risk } from '@/lib/types';

export default function HomePage() {
  // State for dashboard data
  const [overview, setOverview] = useState<any>(null);
  const [phases, setPhases] = useState<Phase[] | null>(null);
  const [supportData, setSupportData] = useState<any>(null);
  const [risksData, setRisksData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to load dashboard data
  const loadDashboardData = async () => {
    try {
      // First try to fetch from Google Cloud Storage via API
      console.log('🔄 Fetching dashboard data from Google Cloud Storage...');
      const apiData = await fetchDashboardDataFromAPI();

      if (apiData) {
        console.log('✅ Successfully loaded data from GCS');
      } else {
        console.log('⚠️ Using fallback data');
      }

      // After fetching (or if fetch failed), get the current data
      setOverview(getDashboardOverview());
      setPhases(getPhases());
      setSupportData(getSupportActivities());
      setRisksData(getRisksData());
      setTimelineData(getTimelineData());
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Provide fallback data
      setOverview({ total_activities: 0, completed_activities: 0, in_progress_activities: 0, delayed_activities: 0, not_started_activities: 0, completion_percentage: 0 });
      setPhases([]);
      setSupportData({ activities: [], completed_support: 0, total_support: 0 });
      setRisksData({ risks_list: [], active_risks: 0, resolved_risks: 0, total_risks: 0 });
      setTimelineData({ time_progress_percentage: 0, activity_progress_percentage: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  // Load data on component mount and listen for localStorage changes
  useEffect(() => {
    loadDashboardData();

    // Listen for localStorage changes (when data is uploaded)
    const handleStorageChange = () => {
      console.log('LocalStorage changed, reloading dashboard data');
      loadDashboardData();
    };

    // Listen for storage events and custom events
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dashboard-data-updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dashboard-data-updated', handleStorageChange);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">جاري تحميل البيانات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            لوحة التحكم الإدارية
          </h1>
          <p className="text-muted-foreground">
            نظرة عامة شاملة على تقدم المشروع وحالة الأنشطة والمراحل
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex gap-2">
            <Link href="/data-upload">
              <Button variant="outline" size="default" className="gap-2">
                <Upload className="h-4 w-4" />
                رفع ملف جديد
              </Button>
            </Link>
            <RefreshButton />
          </div>
          <DataSyncIndicator />
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="إجمالي الأنشطة"
          value={overview?.total_activities || 0}
          icon="Activity"
          animate
          className="border-l-blue-500"
        />
        
        <KPICard
          title="الأنشطة المكتملة"
          value={overview?.completed_activities || 0}
          subtitle={`${Math.round(overview?.completion_percentage || 0)}% من إجمالي المشروع`}
          icon="CheckCircle2"
          animate
          className="border-l-green-500"
        />
        
        <KPICard
          title="الأنشطة قيد التنفيذ"
          value={overview?.in_progress_activities || 0}
          icon="Clock"
          animate
          className="border-l-yellow-500"
        />
        
        <KPICard
          title="المخاطر النشطة"
          value={risksData?.active_risks || 0}
          subtitle={`من أصل ${risksData?.total_risks || 0} مخاطر`}
          icon="AlertCircle"
          animate
          className="border-l-red-500"
        />
      </section>

      {/* Progress Overview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              توزيع حالة الأنشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressChart
              completed={overview?.completed_activities || 0}
              inProgress={overview?.in_progress_activities || 0}
              delayed={overview?.delayed_activities || 0}
              notStarted={overview?.not_started_activities || 0}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              مقارنة التقدم الزمني والأنشطة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TimelineComparison
              timeProgress={timelineData?.time_progress_percentage || 0}
              activityProgress={timelineData?.activity_progress_percentage || 0}
            />
          </CardContent>
        </Card>
      </section>

      {/* Phase Progress Cards */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">تقدم المراحل</h2>
          <Badge variant="outline">
            {phases?.length || 0} مراحل
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases?.map((phase, index) => (
            <PhaseCard 
              key={index} 
              phase={phase} 
              index={index}
            />
          )) || (
            <div className="col-span-full text-center text-muted-foreground py-8">
              لا توجد مراحل متاحة
            </div>
          )}
        </div>
      </section>

      {/* Phase Progress Chart */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              نسبة اكتمال المراحل
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PhaseProgress phases={phases || []} />
          </CardContent>
        </Card>
      </section>

      {/* Recent Activities Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              أعمال الدعم التشغيلي
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-green-600">
                {supportData?.completed_support || 0}
              </span>
              <span className="text-sm text-muted-foreground">
                من أصل {supportData?.total_support || 0} مكتملة
              </span>
            </div>
            
            <div className="space-y-2">
              {supportData?.activities?.slice(0, 3)?.map((activity: SupportActivity, index: number) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity['أعمال الدعم التشغيلي']}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity['المسؤول من الفريق']} - {activity['تاريخ الانتهاء']}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد أعمال دعم متاحة
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              المخاطر والتحديات
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {risksData?.active_risks || 0}
                </div>
                <div className="text-sm text-red-600">نشطة</div>
              </div>
              
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {risksData?.resolved_risks || 0}
                </div>
                <div className="text-sm text-green-600">محلولة</div>
              </div>
            </div>
            
            <div className="space-y-2">
              {risksData?.risks_list?.filter((risk: Risk) => risk.الحالة === 'قائم')?.slice(0, 2)?.map((risk: Risk, index: number) => (
                <div key={index} className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Badge variant="destructive" className="text-xs">
                      {risk.النوع}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {risk.الحالة}
                    </Badge>
                  </div>
                  <p className="text-sm mt-2 leading-relaxed">
                    {risk['المخاطر والتحديات']?.length > 100 
                      ? `${risk['المخاطر والتحديات']?.substring(0, 100)}...`
                      : risk['المخاطر والتحديات']
                    }
                  </p>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground text-center py-4">
                  لا توجد مخاطر نشطة
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
