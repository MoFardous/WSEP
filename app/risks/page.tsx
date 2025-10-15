
'use client';

import { useState, useMemo, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  Search,
  Filter,
  Shield,
  AlertCircle,
  CheckCircle2,
  Zap,
  XCircle
} from 'lucide-react';
import { getRisksData, fetchDashboardDataFromAPI } from '@/lib/dashboard-data';
import { Risk, RiskStatus, RiskType } from '@/lib/types';
import { toast } from 'sonner';

export default function RisksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [risksList, setRisksList] = useState<Risk[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardDataFromAPI();
      const risksData = getRisksData();
      setRisksList(risksData?.risks_list || []);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const filteredRisks = useMemo(() => {
    return risksList?.filter(risk => {
      const matchesSearch = searchTerm === '' || 
        risk['المخاطر والتحديات']?.toLowerCase()?.includes(searchTerm.toLowerCase()) ||
        risk['آليات المعالجة']?.toLowerCase()?.includes(searchTerm.toLowerCase());
      
      const matchesStatus = selectedStatus === 'all' || risk.الحالة === selectedStatus;
      const matchesType = selectedType === 'all' || risk.النوع === selectedType;
      
      return matchesSearch && matchesStatus && matchesType;
    }) || [];
  }, [risksList, searchTerm, selectedStatus, selectedType]);

  const riskStats = useMemo(() => {
    const stats = {
      total: risksList?.length || 0,
      active: risksList?.filter(risk => risk.الحالة === 'قائم')?.length || 0,
      resolved: risksList?.filter(risk => risk.الحالة === 'منتهي')?.length || 0,
      risks: risksList?.filter(risk => risk.النوع === 'خطر')?.length || 0,
      challenges: risksList?.filter(risk => risk.النوع === 'تحدي')?.length || 0,
    };
    return stats;
  }, [risksList]);

  const getStatusIcon = (status: RiskStatus) => {
    switch (status) {
      case 'قائم':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'منتهي':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: RiskType) => {
    switch (type) {
      case 'خطر':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'تحدي':
        return <Zap className="h-4 w-4 text-yellow-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: RiskStatus) => {
    switch (status) {
      case 'قائم':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'منتهي':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: RiskType) => {
    switch (type) {
      case 'خطر':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'تحدي':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          المخاطر والتحديات
        </h1>
        <p className="text-muted-foreground">
          متابعة وإدارة المخاطر والتحديات وآليات معالجتها
        </p>
      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {riskStats.total}
            </div>
            <div className="text-sm text-muted-foreground">إجمالي المخاطر</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {riskStats.active}
            </div>
            <div className="text-sm text-muted-foreground">نشطة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {riskStats.resolved}
            </div>
            <div className="text-sm text-muted-foreground">محلولة</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-500">
              {riskStats.risks}
            </div>
            <div className="text-sm text-muted-foreground">مخاطر</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-500">
              {riskStats.challenges}
            </div>
            <div className="text-sm text-muted-foreground">تحديات</div>
          </CardContent>
        </Card>
      </section>

      {/* Risk Resolution Rate */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              معدل حل المخاطر
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-red-50 dark:bg-red-950/20 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-red-600 mb-1">
                  {riskStats.active}
                </div>
                <div className="text-sm text-red-600">مخاطر نشطة</div>
              </div>
              
              <div className="text-center p-6 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {riskStats.resolved}
                </div>
                <div className="text-sm text-green-600">مخاطر محلولة</div>
              </div>
              
              <div className="text-center p-6 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Shield className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {Math.round((riskStats.resolved / (riskStats.total || 1)) * 100)}%
                </div>
                <div className="text-sm text-blue-600">معدل الحل</div>
              </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="البحث في المخاطر والتحديات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="حالة المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="قائم">نشطة</SelectItem>
              <SelectItem value="منتهي">محلولة</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger>
              <SelectValue placeholder="نوع المخاطر" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="خطر">مخاطر</SelectItem>
              <SelectItem value="تحدي">تحديات</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </section>

      {/* Risks List */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            قائمة المخاطر والتحديات ({filteredRisks?.length || 0})
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => toast.success('جاري تصدير قائمة المخاطر...')}
          >
            تصدير القائمة
          </Button>
        </div>

        <div className="space-y-4">
          {filteredRisks?.map((risk, index) => (
            <Card key={index} className="card-hover">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(risk.النوع as RiskType)}
                        {getStatusIcon(risk.الحالة as RiskStatus)}
                        <div className="flex gap-2">
                          <Badge className={getTypeColor(risk.النوع as RiskType)}>
                            {risk.النوع}
                          </Badge>
                          <Badge className={getStatusColor(risk.الحالة as RiskStatus)}>
                            {risk.الحالة}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-2">وصف المخاطر/التحدي:</h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {risk['المخاطر والتحديات']}
                          </p>
                        </div>
                        
                        {risk['آليات المعالجة'] && (
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              آليات المعالجة:
                            </h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {risk['آليات المعالجة']}
                            </p>
                          </div>
                        )}
                        
                        {!risk['آليات المعالجة'] && risk.الحالة === 'قائم' && (
                          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                            <div className="flex items-center gap-2">
                              <XCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm font-medium text-red-600">
                                لم يتم تحديد آليات معالجة لهذا المخاطر النشط
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toast.success('جاري فتح نظام إدارة المخاطر...')}
                    >
                      إدارة المخاطر
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )) || (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  لا توجد مخاطر تطابق معايير البحث المحددة
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
}
