"use client";

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function useDataRefresh() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  const refreshData = async () => {
    setIsRefreshing(true);
    
    try {
      const response = await fetch('/api/refresh-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "تم تحديث البيانات بنجاح ✅",
          description: "تم تحديث لوحة التحكم بأحدث البيانات من ملف Excel",
          duration: 5000,
        });
        
        // Refresh the page to show updated data
        window.location.reload();
      } else {
        throw new Error(result.message || 'فشل في تحديث البيانات');
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "خطأ في تحديث البيانات ❌",
        description: error instanceof Error ? error.message : 'حدث خطأ غير متوقع',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    refreshData,
    isRefreshing
  };
}