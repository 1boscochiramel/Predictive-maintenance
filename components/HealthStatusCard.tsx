import React from 'react';
import type { HealthState } from '../types';

interface HealthStatusCardProps {
  state: HealthState;
  color: string;
}

const statusIcons = {
  Healthy: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Degrading: (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.01-1.742 3.01H4.42c-1.53 0-2.493-1.676-1.743-3.01l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  Failure: (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
     </svg>
  ),
};

export const HealthStatusCard: React.FC<HealthStatusCardProps> = ({ state, color }) => {
  return (
    <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full flex flex-col justify-center">
      <h3 className="text-lg font-medium text-gray-400 text-center">Health Status</h3>
      <div className="mt-2 flex items-center justify-center flex-col text-center">
        <div style={{ color: color }}>
          {statusIcons[state]}
        </div>
        <p className="text-3xl font-bold mt-2" style={{ color: color }}>{state}</p>
      </div>
    </div>
  );
};