"use client";

import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

export default function DataUploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!file || !file.name.endsWith('.xlsx')) {
      toast({
        title: "نوع ملف غير صحيح ❌",
        description: "يرجى رفع ملف Excel بامتداد .xlsx فقط",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus('uploading');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-excel', {
        method: 'POST',
        body: formData,
      });

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const result = await response.json();
      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success) {
        setUploadStatus('success');
        toast({
          title: "تم رفع الملف بنجاح ✅",
          description: `تم تحديث لوحة التحكم بـ ${result.totalActivities} نشاط`,
          duration: 5000,
        });

        // Auto-redirect to dashboard after 3 seconds
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        throw new Error(result.message || 'فشل في معالجة الملف');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      toast({
        title: "خطأ في رفع الملف ❌",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            رفع ملف البيانات
          </h1>
          <p className="text-muted-foreground">
            قم برفع ملف Excel الجديد لتحديث بيانات لوحة التحكم
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            رفع ملف Excel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              accept=".xlsx"
              onChange={onFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
            
            <div className="space-y-4">
              {uploadStatus === 'idle' && (
                <>
                  <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">
                      اسحب وأفلت ملف Excel هنا
                    </p>
                    <p className="text-sm text-muted-foreground">
                      أو اضغط لاختيار الملف من جهازك
                    </p>
                    <p className="text-xs text-muted-foreground">
                      يدعم ملفات .xlsx فقط
                    </p>
                  </div>
                </>
              )}

              {uploadStatus === 'uploading' && (
                <>
                  <div className="mx-auto w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-blue-500 animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    <p className="text-lg font-medium">جاري رفع الملف...</p>
                    <Progress value={uploadProgress} className="w-full max-w-xs mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      {uploadProgress}% مكتمل
                    </p>
                  </div>
                </>
              )}

              {uploadStatus === 'success' && (
                <>
                  <div className="mx-auto w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-green-600">
                      تم رفع الملف بنجاح! ✅
                    </p>
                    <p className="text-sm text-muted-foreground">
                      سيتم توجيهك إلى لوحة التحكم خلال ثوانٍ...
                    </p>
                  </div>
                </>
              )}

              {uploadStatus === 'error' && (
                <>
                  <div className="mx-auto w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-500" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium text-red-600">
                      فشل في رفع الملف ❌
                    </p>
                    <p className="text-sm text-muted-foreground">
                      يرجى المحاولة مرة أخرى
                    </p>
                    <Button
                      onClick={() => {
                        setUploadStatus('idle');
                        setUploadProgress(0);
                      }}
                      variant="outline"
                      size="sm"
                    >
                      المحاولة مرة أخرى
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold">تعليمات مهمة:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>تأكد من أن الملف بصيغة Excel (.xlsx)</li>
              <li>يجب أن يحتوي على الأوراق التالية: "أنشطة المشروع وحالتها"، "أعمال الدعم التشغيلي"، "المخاطر والتحديات"</li>
              <li>سيتم استبدال جميع البيانات الحالية بالبيانات الجديدة</li>
              <li>تأكد من صحة البيانات قبل الرفع</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Current Data Info */}
      <Card>
        <CardHeader>
          <CardTitle>معلومات البيانات الحالية</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">40</div>
              <div className="text-sm text-muted-foreground">إجمالي الأنشطة</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-muted-foreground">الأنشطة المكتملة</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">20%</div>
              <div className="text-sm text-muted-foreground">نسبة الإنجاز</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}