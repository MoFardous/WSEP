
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend, Tooltip, LabelList } from 'recharts';

interface TimelineComparisonProps {
  timeProgress: number;
  activityProgress: number;
}

export function TimelineComparison({ timeProgress, activityProgress }: TimelineComparisonProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  const data = [
    {
      name: 'التقدم',
      'نسبة التقدم الزمني': Math.round(timeProgress * 100) / 100,
      'نسبة اكتمال الأنشطة': Math.round(activityProgress * 100) / 100,
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-bold"
      >
        {`${value}%`}
      </text>
    );
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">جاري تحميل المخطط...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis 
            dataKey="name" 
            tickLine={false}
            tick={{ fontSize: 10 }}
          />
          <YAxis 
            tickLine={false}
            tick={{ fontSize: 10 }}
            label={{ 
              value: 'النسبة المئوية', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 11 }}
          />
          <Bar 
            dataKey="نسبة التقدم الزمني" 
            fill="#60B5FF" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList content={<CustomLabel />} />
          </Bar>
          <Bar 
            dataKey="نسبة اكتمال الأنشطة" 
            fill="#72BF78" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
