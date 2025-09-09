
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Phase } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Activity, CheckCircle2 } from 'lucide-react';

interface PhaseCardProps {
  phase: Phase;
  index: number;
}

export function PhaseCard({ phase, index }: PhaseCardProps) {
  const completionPercentage = Math.round(phase.completion_percentage || 0);

  const getStatusColor = (percentage: number) => {
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 50) return 'bg-yellow-500';
    if (percentage > 0) return 'bg-blue-500';
    return 'bg-gray-500';
  };

  const getStatusText = (percentage: number) => {
    if (percentage === 100) return 'مكتملة';
    if (percentage >= 50) return 'قيد التقدم';
    if (percentage > 0) return 'بدأت';
    return 'لم تبدأ';
  };

  return (
    <Card className="card-hover transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getStatusColor(completionPercentage)}`} />
            <CardTitle className="text-lg">المرحلة {index + 1}</CardTitle>
          </div>
          <Badge variant="outline" className="text-xs">
            {getStatusText(completionPercentage)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground leading-relaxed">
          {phase.name}
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-primary">
              {completionPercentage}%
            </span>
            <span className="text-sm text-muted-foreground">
              نسبة الاكتمال
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-lg font-semibold">
                {phase.completed_activities || 0}
              </div>
              <div className="text-xs text-muted-foreground">مكتملة</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-lg font-semibold">
                {phase.total_activities || 0}
              </div>
              <div className="text-xs text-muted-foreground">إجمالي</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
