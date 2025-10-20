import React from 'react';
import type { PerformanceMetrics } from '../types';

interface PerformanceCardProps {
    metrics: PerformanceMetrics;
}

const PerfItem: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const isSlow = (label.includes('Feature') && value > 800) ||
                   (label.includes('Model') && value > 300) ||
                   (label.includes('SHAP') && value > 500) ||
                   (label.includes('Render') && value > 200);

    return (
        <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
            <dt className="text-sm font-medium text-gray-400">{label}</dt>
            <dd className={`text-sm font-mono px-2 py-0.5 rounded flex items-center ${isSlow ? 'bg-yellow-900/60 text-yellow-300' : 'bg-gray-700/50 text-gray-200'}`}>
                {isSlow && (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 3.01-1.742 3.01H4.42c-1.53 0-2.493-1.676-1.743-3.01l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                )}
                {value} ms
            </dd>
        </div>
    );
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({ metrics }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Performance SLOs</h3>
            <dl>
                <PerfItem label="Feature Extraction" value={metrics.feature_ms} />
                <PerfItem label="Model Inference" value={metrics.model_ms} />
                <PerfItem label="SHAP Computation" value={metrics.shap_ms} />
                <PerfItem label="Render Update" value={metrics.render_ms} />
            </dl>
        </div>
    );
};