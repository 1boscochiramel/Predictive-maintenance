import React from 'react';
import type { PdmAnalysis, AccessibilityMetrics } from '../types';

type MetadataCardProps = {
    models: PdmAnalysis['models'];
    tests: PdmAnalysis['tests_passed'];
    changelog: PdmAnalysis['changelog_ref'];
    accessibility: AccessibilityMetrics;
    feedbackId: string;
}

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const MetaItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-200 font-mono">{value}</dd>
    </div>
);

const AccessibilityCheck: React.FC<{ label: string, passed: boolean }> = ({ label, passed }) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${passed ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
        <CheckCircleIcon className="w-4 h-4 mr-1.5" />
        {label}
    </span>
);


export const MetadataCard: React.FC<MetadataCardProps> = ({ models, tests, changelog, accessibility, feedbackId }) => {
  return (
    <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full">
        <h3 className="text-xl font-semibold text-white mb-4">Analysis Metadata</h3>
        <dl>
            <MetaItem label="Random Forest Ver." value={models.rf_ver} />
            <MetaItem label="XGBoost Ver." value={models.xgb_ver} />
            <MetaItem label="Feature Schema" value={models.feature_schema} />
             <div className="py-2 border-b border-gray-700">
                <dt className="text-sm font-medium text-gray-400 mb-2">Data Quality Checks</dt>
                <dd className="flex flex-wrap gap-2">
                    {tests.map(test => (
                        <span key={test} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/50 text-green-300 border border-green-700">
                            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
                            {test} Passed
                        </span>
                    ))}
                </dd>
            </div>
             <div className="py-2 border-b border-gray-700">
                <dt className="text-sm font-medium text-gray-400 mb-2">Accessibility Checks</dt>
                <dd className="flex flex-wrap gap-2">
                    <AccessibilityCheck label="Contrast" passed={accessibility.contrast_ok} />
                    <AccessibilityCheck label="Keyboard Nav" passed={accessibility.keyboard_ok} />
                    <AccessibilityCheck label="Mobile" passed={accessibility.mobile_ok} />
                </dd>
            </div>
            <div className="pt-3 border-b border-gray-700 pb-2">
                <dt className="text-sm font-medium text-gray-400">Changelog Ref</dt>
                <dd className="text-xs text-gray-500 font-mono mt-1 break-all">{changelog}</dd>
            </div>
             <div className="pt-3">
                <dt className="text-sm font-medium text-gray-400">Feedback ID</dt>
                <dd className="text-xs text-gray-500 font-mono mt-1 break-all">{feedbackId}</dd>
            </div>
        </dl>
    </div>
  );
};