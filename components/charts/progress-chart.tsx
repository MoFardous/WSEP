
'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LabelList } from 'recharts';

interface ProgressChartProps {
  completed: number;
  inProgress: number;
  delayed: number;
  notStarted: number;
}

const COLORS = {
  completed: '#72BF78',
  inProgress: '#60B5FF', 
  delayed: '#FF6363',
  notStarted: '#A19AD3'
};

export function ProgressChart({ completed, inProgress, delayed, notStarted }: ProgressChartProps) {
  const total = completed + inProgress + delayed + notStarted;
  
  const data = [
    {
      name: 'مكتمل',
      value: completed,
      color: COLORS.completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    },
    {
      name: 'قيد التنفيذ',
      value: inProgress,
      color: COLORS.inProgress,
      percentage: total > 0 ? Math.round((inProgress / total) * 100) : 0,
    },
    {
      name: 'متأخر',
      value: delayed,
      color: COLORS.delayed,
      percentage: total > 0 ? Math.round((delayed / total) * 100) : 0,
    },
    {
      name: 'لم يبدأ',
      value: notStarted,
      color: COLORS.notStarted,
      percentage: total > 0 ? Math.round((notStarted / total) * 100) : 0,
    },
  ].filter(item => item.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-background border rounded-lg p-3 shadow-md">
          <p className="text-sm font-medium">{`${data.name}: ${data.value} (${data.payload.percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, percentage }: any) => {
    if (percentage < 5) return null; // Don't show labels for very small slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-bold"
      >
        {`${value}`}
      </text>
    );
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="top"
            height={36}
            wrapperStyle={{ fontSize: 11 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
