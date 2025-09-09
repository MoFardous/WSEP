
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  RefreshCw, 
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileSpreadsheet,
  Link,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

export default function DataSyncPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [googleSheetsUrl, setGoogleSheetsUrl] = useState('');
  const [lastSync, setLastSync] = useState('2024-09-08 10:30:00');
  const [syncStatus, setSyncStatus] = useState<'success' | 'error' | 'pending'>('success');

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    setSyncStatus('pending');
    
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      setSyncStatus('success');
      setLastSync(new Date().toLocaleString('ar-SA'));
      toast.success('تم تحديث البيانات بنجاح');
    }, 2000);
  };

  const handleExportData = () => {
    toast.success('جاري تصدير البيانات...');
    // Simulate export
    setTimeout(() => {
      toast.success('تم تصدير البيانات بنجاح');
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`تم رفع الملف: ${file.name}`);
    }
  };

  const getSyncStatusIcon = () => {
    switch (syncStatus) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSyncStatusColor = () => {
    switch (syncStatus) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-200';
    }
  };

  const getSyncStatusText = () => {
    switch (syncStatus) {
      case 'success':
        return 'متزامن';
      case 'error':
        return 'خطأ';
      case 'pending':
        return 'جاري المزامنة';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          مزامنة البيانات
        </h1>
        <p className="text-muted-foreground">
          إدارة مزامنة البيانات مع Google Sheets ورفع الملفات وتصدير التقارير
        </p>
      </div>

      {/* Sync Status Overview */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-3">
              {getSyncStatusIcon()}
            </div>
            <div className="text-lg font-semibold mb-1">
              حالة المزامنة
            </div>
            <Badge className={getSyncStatusColor()}>
              {getSyncStatusText()}
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Clock className="h-6 w-6 text-blue-500 mx-auto mb-3" />
            <div className="text-lg font-semibold mb-1">
              آخر مزامنة
            </div>
            <div className="text-sm text-muted-foreground">
              {lastSync}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <Database className="h-6 w-6 text-green-500 mx-auto mb-3" />
            <div className="text-lg font-semibold mb-1">
              حجم البيانات
            </div>
            <div className="text-sm text-muted-foreground">
              135 سجل
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 text-center">
            <FileSpreadsheet className="h-6 w-6 text-purple-500 mx-auto mb-3" />
            <div className="text-lg font-semibold mb-1">
              مصدر البيانات
            </div>
            <div className="text-sm text-muted-foreground">
              Excel & JSON
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Actions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              إجراءات سريعة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="h-16 text-base"
              >
                {isRefreshing ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    جاري التحديث...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2" />
                    تحديث البيانات
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleExportData}
                className="h-16 text-base"
              >
                <Download className="h-5 w-5 mr-2" />
                تصدير البيانات
              </Button>
              
              <Button
                variant="outline"
                className="h-16 text-base"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <Upload className="h-5 w-5 mr-2" />
                رفع ملف Excel
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Google Sheets Integration */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              ربط Google Sheets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                رابط Google Sheets
              </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={googleSheetsUrl}
                  onChange={(e) => setGoogleSheetsUrl(e.target.value)}
                />
                <Button onClick={() => {
                  if (googleSheetsUrl.trim()) {
                    toast.success('تم ربط Google Sheets بنجاح');
                  } else {
                    toast.error('يرجى إدخال رابط Google Sheets');
                  }
                }}>
                  ربط
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    نصائح للربط بـ Google Sheets:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-200 mt-2 space-y-1 list-disc list-inside">
                    <li>تأكد من أن الملف مشارك للعامة أو معك بصلاحية التحرير</li>
                    <li>استخدم الرابط المباشر للملف وليس رابط المعاينة</li>
                    <li>سيتم مزامنة البيانات كل 30 دقيقة تلقائياً</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Data Sources */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              مصادر البيانات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-500" />
                  <div>
                    <div className="font-medium">Dashboard Data Input.xlsx</div>
                    <div className="text-sm text-muted-foreground">
                      الملف الأساسي للبيانات - آخر تحديث: 2024-09-08
                    </div>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200">
                  نشط
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">dashboard_data.json</div>
                    <div className="text-sm text-muted-foreground">
                      البيانات المعالجة في تنسيق JSON - محدّث تلقائياً
                    </div>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                  متزامن
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Link className="h-8 w-8 text-purple-500" />
                  <div>
                    <div className="font-medium">Google Sheets</div>
                    <div className="text-sm text-muted-foreground">
                      مصدر خارجي للمزامنة المباشرة - غير مرتبط
                    </div>
                  </div>
                </div>
                <Badge variant="outline">
                  غير متصل
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Sync History */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              سجل المزامنة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { time: '2024-09-08 10:30:00', status: 'نجح', records: 135, type: 'تحديث تلقائي' },
                { time: '2024-09-08 08:15:00', status: 'نجح', records: 134, type: 'مزامنة يدوية' },
                { time: '2024-09-08 06:00:00', status: 'نجح', records: 132, type: 'تحديث تلقائي' },
                { time: '2024-09-07 22:45:00', status: 'فشل', records: 0, type: 'خطأ في الاتصال' },
                { time: '2024-09-07 18:30:00', status: 'نجح', records: 132, type: 'رفع ملف' },
              ].map((sync, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    {sync.status === 'نجح' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm font-medium">{sync.type}</div>
                      <div className="text-xs text-muted-foreground">{sync.time}</div>
                    </div>
                  </div>
                  <div className="text-left">
                    <Badge className={sync.status === 'نجح' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200'
                    }>
                      {sync.status}
                    </Badge>
                    {sync.status === 'نجح' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        {sync.records} سجل
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
