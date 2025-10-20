
import React from 'react';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  confidenceInterval?: [number, number];
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, confidenceInterval }) => {
  return (
    <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 flex flex-col justify-between">
      <h3 className="text-lg font-medium text-gray-400">{title}</h3>
      <div className="mt-2 text-center">
        <p className="text-5xl font-bold text-cyan-400">{value}
          {unit && <span className="text-2xl text-gray-300 ml-2">{unit}</span>}
        </p>
        {confidenceInterval && (
          <p className="text-sm text-gray-500 mt-1">
            95% CI: [{confidenceInterval[0]}, {confidenceInterval[1]}] days
          </p>
        )}
      </div>
    </div>
  );
};
