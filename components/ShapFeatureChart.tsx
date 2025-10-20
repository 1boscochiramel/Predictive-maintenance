
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ShapFeature } from '../types';

interface ShapFeatureChartProps {
  features: ShapFeature[];
}

// Custom Tooltip for better styling
const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-600 p-3 rounded-md shadow-lg text-sm">
        <p className="font-bold text-gray-200">{`${label}`}</p>
        <p className="text-cyan-400">{`SHAP Value: ${data.phi.toFixed(4)}`}</p>
        {data.note && <p className="text-gray-400 mt-1">{data.note}</p>}
      </div>
    );
  }
  return null;
};


export const ShapFeatureChart: React.FC<ShapFeatureChartProps> = ({ features }) => {
  const data = [...features].reverse(); // Reverse for top-down display in chart

  return (
    <div role="figure" aria-label="Bar chart showing top risk contributors and their SHAP values" style={{ width: '100%', height: 300 }}>
       <ResponsiveContainer>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            type="category"
            dataKey="feature"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={100}
            tickFormatter={(value) => value.replace(/_/g, ' ')}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}/>
          <Bar dataKey="phi" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.direction === '+' ? '#ef4444' : '#22c55e'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
