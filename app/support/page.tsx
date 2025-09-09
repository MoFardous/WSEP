
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar,
  CheckCircle2,
  User
} from 'lucide-react';
import { getSupportActivities } from '@/lib/dashboard-data';
import { toast } from 'sonner';

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('all');
  
  const supportData = getSupportActivities();
  const activities = supportData?.activities || [];

  const teamMembers = useMemo(() => {
    const members = new Set<string>();
    activities?.forEach(activity => {
      const member = activity['المسؤول من الفريق'];
      if (member) {
        members.add(member);
      }
    });
    return Array.from(members).sort();
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities?.filter(activity => {
      const matchesSearch = searchTerm === '' || 
        activity['أعمال الدعم التشغيلي']?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        activity['المسؤول من الفريق']?.toLowerCase()?.includes(searchTerm.toLowerCase());
      
      const matchesMember = selectedMember === 'all' || 
        activity['المسؤول من الفريق'] === selectedMember;
      
      return matchesSearch && matchesMember;
    }) || [];
  }, [activities, searchTerm, selectedMember]);

  const memberStats = useMemo(() => {
    const stats: Record<string, number> = {};
    activities?.forEach(activity => {
      const member = activity['المسؤول من الفريق'];
      if (member) {
        stats[member] = (stats[member] || 0) + 1;
      }
    });
    return stats;
  }, [activities]);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          أعمال الدعم التشغيلي
        </h1>
        <p className="text-muted-foreground">
          متابعة وإدارة أعمال الدعم التشغيلي وتوزيع المهام على أعضاء الفريق
        </p>
      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {supportData?.total_support || 0}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي أعمال الدعم</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {supportData?.completed_support || 0}
            </div>
            <div className="text-sm text-muted-foreground">مكتملة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {teamMembers?.length || 0}
            </div>
            <div className="text-sm text-muted-foreground">أعضاء الفريق</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(((supportData?.completed_support || 0) / (supportData?.total_support || 1)) * 100)}%
            </div>
            <div className="text-sm text-muted-foreground">معدل الإنجاز</div>
          </CardContent>
        </Card>
      </section>

      {/* Team Members Statistics */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              إحصائيات أعضاء الفريق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {teamMembers?.map(member => (
                <div key={member} className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <User className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <div className="font-medium">{member}</div>
                    <div className="text-sm text-muted-foreground">
                      {memberStats[member] || 0} مهمة
                    </div>
                  </div>
                </div>
              )) || (
                <div className="col-span-full text-center text-muted-foreground py-8">
                  لا توجد بيانات أعضاء فريق
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Filters */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">تصفية النتائج</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في أعمال الدعم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={selectedMember} onValueChange={setSelectedMember}>
            <SelectTrigger>
              <SelectValue placeholder="اختر عضو الفريق" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأعضاء</SelectItem>
              {teamMembers?.map(member => (
                <SelectItem key={member} value={member}>
                  {member} ({memberStats[member] || 0} مهمة)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Support Activities List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            قائمة أعمال الدعم ({filteredActivities?.length || 0})
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success('جاري تصدير قائمة أعمال الدعم...')}
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
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-lg leading-relaxed">
                          {activity['أعمال الدعم التشغيلي']}
                        </h3>
                      </div>
                    </div>
                    
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                      {activity.الحالة}
                    </Badge>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium text-foreground">
                          {activity['المسؤول من الفريق']}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          تم الانتهاء: {activity['تاريخ الانتهاء']}
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success('جاري فتح تفاصيل عمل الدعم...')}
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
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  لا توجد أعمال دعم تطابق معايير البحث المحددة
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
