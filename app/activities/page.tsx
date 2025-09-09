
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  CircleDot
} from 'lucide-react';
import { getAllActivities, getPhases } from '@/lib/dashboard-data';
import { Activity as ActivityType, ActivityStatus } from '@/lib/types';
import { toast } from 'sonner';

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPhase, setSelectedPhase] = useState<string>('all');
  
  const allActivities = getAllActivities();
  const phases = getPhases();

  const filteredActivities = useMemo(() => {
    return allActivities?.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity['النشاط الرئيسي']?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        activity['النشاط الفرعي']?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        activity.المرحلة?.toLowerCase()?.includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || activity.الحالة === selectedStatus;
      const matchesPhase = selectedPhase === 'all' || activity.المرحلة === selectedPhase;
      
      return matchesSearch && matchesStatus && matchesPhase;
    }) || [];
  }, [allActivities, searchTerm, selectedStatus, selectedPhase]);

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'مكتمل':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'قيد التنفيذ':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'متأخر':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'لم يبدأ':
        return <CircleDot className="h-4 w-4 text-gray-500" />;
      default:
        return <CircleDot className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'مكتمل':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'قيد التنفيذ':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200';
      case 'متأخر':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'لم يبدأ':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const statusCounts = useMemo(() => {
    const counts = {
      total: allActivities?.length || 0,
      مكتمل: 0,
      'قيد التنفيذ': 0,
      متأخر: 0,
      'لم يبدأ': 0
    };
    
    allActivities?.forEach(activity => {
      const status = activity.الحالة as ActivityStatus;
      if (counts.hasOwnProperty(status)) {
        counts[status]++;
      }
    });
    
    return counts;
  }, [allActivities]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          الأنشطة والمهام
        </h1>
        <p className="text-muted-foreground">
          عرض تفصيلي لجميع أنشطة المشروع مع إمكانية البحث والتصفية
        </p>
      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.total}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي الأنشطة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.مكتمل}
            </div>
            <div className="text-sm text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts['قيد التنفيذ']}
            </div>
            <div className="text-sm text-muted-foreground">قيد التنفيذ</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.متأخر}
            </div>
            <div className="text-sm text-muted-foreground">متأخرة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {statusCounts['لم يبدأ']}
            </div>
            <div className="text-sm text-muted-foreground">لم تبدأ</div>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">تصفية النتائج</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في الأنشطة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="حالة النشاط" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="مكتمل">مكتمل</SelectItem>
              <SelectItem value="قيد التنفيذ">قيد التنفيذ</SelectItem>
              <SelectItem value="متأخر">متأخر</SelectItem>
              <SelectItem value="لم يبدأ">لم يبدأ</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPhase} onValueChange={setSelectedPhase}>
            <SelectTrigger>
              <SelectValue placeholder="المرحلة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع المراحل</SelectItem>
              {phases?.map((phase, index) => (
                <SelectItem key={index} value={phase.name}>
                  المرحلة {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Activities List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            قائمة الأنشطة ({filteredActivities?.length || 0})
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success('جاري تصدير قائمة الأنشطة...')}
          >
            تصدير القائمة
          </Button>
        </div>

        <div className="space-y-4">
          {filteredActivities?.map((activity, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(activity.الحالة as ActivityStatus)}
                        <h3 className="font-semibold text-lg">
                          {activity['النشاط الرئيسي']}
                        </h3>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {activity['النشاط الفرعي']}
                      </p>
                      
                      <p className="text-sm text-muted-foreground">
                        {activity.المرحلة}
                      </p>
                    </div>
                    
                    <Badge className={getStatusColor(activity.الحالة as ActivityStatus)}>
                      {activity.الحالة}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        البدء: {activity['تاريخ البدء المخطط']}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        الانتهاء: {activity['تاريخ الانتهاء المخطط']}
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success('جاري فتح تفاصيل النشاط...')}
                    >
                      عرض التفاصيل
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="p-12 text-center">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  لا توجد أنشطة تطابق معايير البحث المحددة
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
