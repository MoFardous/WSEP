
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: keyof typeof Icons;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  animate?: boolean;
}

export function KPICard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  className,
  animate = false 
}: KPICardProps) {
  const Icon = Icons[icon] as React.ComponentType<{ className?: string }>;
  const [animatedValue, setAnimatedValue] = useState(animate ? 0 : Number(value));

  useEffect(() => {
    if (animate && typeof value === 'number') {
      const timer = setTimeout(() => {
        let current = 0;
        const increment = value / 30;
        const interval = setInterval(() => {
          current += increment;
          if (current >= value) {
            setAnimatedValue(value);
            clearInterval(interval);
          } else {
            setAnimatedValue(Math.round(current));
          }
        }, 50);
        return () => clearInterval(interval);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, animate]);

  const displayValue = animate ? animatedValue : value;

  return (
    <Card className={cn(
      "card-hover transition-all duration-300 hover:shadow-lg border-l-4 border-l-primary/20",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {typeof displayValue === 'number' ? displayValue.toLocaleString('ar-SA') : displayValue}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {trend && (
          <div className={cn(
            "flex items-center text-xs mt-2",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span className="mr-1">
              {trend.isPositive ? "↗" : "↘"}
            </span>
            {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
