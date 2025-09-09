
'use client';

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { Phase } from '@/lib/types';

interface PhaseProgressProps {
  phases: Phase[];
}

export function PhaseProgress({ phases }: PhaseProgressProps) {
  const data = phases?.map((phase, index) => ({
    name: `المرحلة ${index + 1}`,
    fullName: phase.name,
    percentage: Math.round(phase.completion_percentage || 0),
  })) || [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md max-w-xs">
          <p className="text-sm font-medium mb-1">{data.fullName}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {`نسبة الاكتمال: ${data.percentage}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLabel = (props: any) => {
    const { x, y, width, height, value } = props;
    if (value === 0) return null; // Don't show label for 0%
    
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
              value: 'نسبة الاكتمال', 
              angle: -90, 
              position: 'insideLeft',
              style: { textAnchor: 'middle', fontSize: 11 }
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="percentage" 
            fill="#60B5FF" 
            radius={[4, 4, 0, 0]}
          >
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
