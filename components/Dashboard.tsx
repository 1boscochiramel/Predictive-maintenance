import React, { useState } from 'react';
import type { PdmAnalysis } from '../types';
import { HealthStatusCard } from './HealthStatusCard';
import { ShapFeatureChart } from './ShapFeatureChart';
import { RecommendationCard } from './RecommendationCard';
import { RulGauge } from './RulGauge';
import { PerformanceCard } from './PerformanceCard';
import { ExplanationCard } from './ExplanationCard';
import { FeedbackCard } from './FeedbackCard';
import { ImportInfoCard } from './ImportInfoCard';
import { TrackedTagsCard } from './TrackedTagsCard';
import { AssetSelector } from './AssetSelector';
import { AssetTagSummaryModal } from './AssetTagSummaryModal';
import { ModelInternalsCard } from './ModelInternalsCard';


interface DashboardProps {
  data: PdmAnalysis | null;
  isLoading: boolean;
  error: string | null;
  onImportClick: () => void;
}

const WelcomeMessage: React.FC<{ onImportClick: () => void }> = ({ onImportClick }) => (
    <div className="text-center py-20 px-6 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-300">No Data Loaded</h2>
        <p className="mt-2 text-gray-400">Please import data from a source like Honeywell PHD or a CSV file to begin an analysis.</p>
        <button 
            onClick={onImportClick}
            className="mt-6 text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
        >
            Import Data
        </button>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="text-center py-20 px-6 bg-gray-800/50 rounded-lg">
        <div className="flex justify-center items-center">
            <svg className="animate-spin h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <p className="mt-4 text-lg text-gray-300">Analyzing Asset Data...</p>
        <p className="text-gray-500">This may take a moment.</p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
     <div className="text-center py-20 px-6 bg-red-900/20 border border-red-500 rounded-lg">
        <h2 className="text-2xl font-bold text-red-400">Analysis Failed</h2>
        <p className="mt-2 text-red-300">{message}</p>
    </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ data, isLoading, error, onImportClick }) => {
  const [isTagSummaryOpen, setIsTagSummaryOpen] = useState(false);
  const [isExplainMode, setIsExplainMode] = useState(false);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!data) return <WelcomeMessage onImportClick={onImportClick} />;

  return (
    <div className="space-y-8">
        <AssetSelector isLoading={isLoading} selectedAssetId={data.asset_id.replace('LOUP-', '')} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">Asset: <span className="text-cyan-400">{data.asset_id}</span></h2>
                        <p className="text-gray-400">Analysis as of {new Date(data.timestamp).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                         <div className="flex items-center space-x-2 bg-gray-800 p-1.5 rounded-lg">
                            <span className="text-sm font-medium text-gray-300 pl-2">Explain & Override Mode</span>
                            <button
                                onClick={() => setIsExplainMode(!isExplainMode)}
                                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${isExplainMode ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                aria-pressed={isExplainMode}
                            >
                                {isExplainMode ? 'ON' : 'OFF'}
                            </button>
                        </div>
                        {data.asset_tag_summary && (
                            <button 
                                onClick={() => setIsTagSummaryOpen(true)}
                                className="px-4 py-2 text-sm font-medium rounded-md transition-colors bg-gray-700 text-gray-300 hover:bg-gray-600"
                            >
                                View Monitored Tags
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 gap-6 content-start">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <RulGauge data={data} isExplainMode={isExplainMode} />
                    <HealthStatusCard state={data.health_state} color={data.ui_state.color} />
                </div>
                <ExplanationCard explanation={data.explanation} explanationText={data.explanation_text} />
                <ModelInternalsCard data={data} isExplainMode={isExplainMode} />
                <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Top Risk Contributors (SHAP)</h3>
                    <ShapFeatureChart features={data.shap_summary} />
                </div>
            </div>
            
            <div className="lg:col-span-1 grid grid-cols-1 gap-6 content-start">
                {data.recommendation && <RecommendationCard recommendation={data.recommendation} />}
                {data.data_source && data.import_status && data.data_quality && (
                    <ImportInfoCard 
                        dataSource={data.data_source}
                        importStatus={data.import_status}
                        dataQuality={data.data_quality}
                    />
                )}
                {data.tags_tracked && <TrackedTagsCard tags={data.tags_tracked} />}
                <FeedbackCard />
                <PerformanceCard metrics={data.metrics} />
            </div>
        </div>

        {isTagSummaryOpen && data.asset_tag_summary && (
            <AssetTagSummaryModal 
                isOpen={isTagSummaryOpen}
                onClose={() => setIsTagSummaryOpen(false)}
                summary={data.asset_tag_summary}
            />
        )}
    </div>
  );
};