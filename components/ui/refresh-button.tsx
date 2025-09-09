"use client";

import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDataRefresh } from '@/hooks/use-data-refresh';
import { cn } from '@/lib/utils';

interface RefreshButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  showText?: boolean;
}

export function RefreshButton({ 
  className, 
  variant = "outline", 
  size = "default",
  showText = true 
}: RefreshButtonProps) {
  const { refreshData, isRefreshing } = useDataRefresh();

  return (
    <Button
      onClick={refreshData}
      disabled={isRefreshing}
      variant={variant}
      size={size}
      className={cn(
        "relative transition-all duration-200",
        isRefreshing && "cursor-not-allowed opacity-70",
        className
      )}
    >
      <RefreshCw 
        className={cn(
          "h-4 w-4",
          isRefreshing && "animate-spin",
          showText && "mr-2"
        )} 
      />
      {showText && (
        <span>
          {isRefreshing ? "جاري التحديث..." : "تحديث البيانات"}
        </span>
      )}
    </Button>
  );
}

interface DataSyncIndicatorProps {
  className?: string;
}

export function DataSyncIndicator({ className }: DataSyncIndicatorProps) {
  const { isRefreshing } = useDataRefresh();

  if (!isRefreshing) return null;

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <RefreshCw className="h-3 w-3 animate-spin" />
      <span>جاري مزامنة البيانات من ملف Excel...</span>
    </div>
  );
}