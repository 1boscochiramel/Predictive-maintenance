import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { PdmAnalysis, ExplainPanel } from '../types';
import { ExplainOverrideWrapper } from './ExplainOverrideWrapper';
import { OverrideControl } from './OverrideControl';
import { OVERRIDES_SCHEMA } from '../constants';

interface ModelInternalsCardProps {
    data: PdmAnalysis;
    isExplainMode: boolean;
}

type Tab = 'rf' | 'xgb';


const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return <div className="bg-gray-900 border border-gray-600 p-2 rounded-md shadow-lg text-sm text-gray-200">{`${payload[0].value} Trees`}</div>;
  }
  return null;
};

const formatValue = (value: any) => {
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).map(([k,v]) => `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`).join(', ');
    }
    return value;
}

const StepTracePanel: React.FC<{ panel?: ExplainPanel }> = ({ panel }) => {
    if (!panel) return <p className="text-xs text-center text-gray-500">No explanation data available.</p>;

    return (
        <div className="space-y-2 text-sm">
            {panel.steps.map(step => (
                 <div key={step.step} className="p-2 bg-gray-900/50 rounded">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">{step.step}. {step.desc}</span>
                        {step.formula && <code className="text-cyan-300 font-mono text-xs">{step.formula}</code>}
                    </div>
                    <div className="text-right mt-1">
                       {step.values && <p className="text-xs text-gray-500 font-mono">{formatValue(step.values)}</p>}
                       {step.result && <p className="font-semibold text-gray-200 text-base">{formatValue(step.result)} {step.units}</p>}
                       {step.importance && <p className="text-xs text-gray-400 font-mono">{formatValue(step.importance)}</p>}
                    </div>
                </div>
            ))}
            {panel.narration && (
                <p className="text-center pt-2 text-xs text-gray-400 italic bg-gray-900 p-2 rounded-md">
                    {panel.narration}
                </p>
            )}
        </div>
    );
};


export const ModelInternalsCard: React.FC<ModelInternalsCardProps> = ({ data, isExplainMode }) => {
    const [activeTab, setActiveTab] = useState<Tab>('rf');
    const [rfDegrading, setRfDegrading] = useState(OVERRIDES_SCHEMA.rf_degrading_threshold.default);
    const [rfFailure, setRfFailure] = useState(OVERRIDES_SCHEMA.rf_failure_threshold.default);

    const rfVotes = data.rf_explain_panel?.steps?.find(s => s.desc === 'Tree votes')?.result as Record<string, number> || {};
    const totalVotes = Object.values(rfVotes).reduce((sum, val) => sum + (val * 100), 0); // Assuming result is probability
    
    const chartData = [
        { name: 'Healthy', votes: (rfVotes.Healthy || 0) * 100, color: '#2ECC71' },
        { name: 'Degrading', votes: (rfVotes.Degrading || 0) * 100, color: '#F1C40F' },
        { name: 'Failure', votes: (rfVotes.Failure || 0) * 100, color: '#E74C3C' },
    ];
    
    const rfOverrides = (
        <div className="space-y-4">
            <OverrideControl label="Degrading Threshold" value={rfDegrading} onChange={setRfDegrading} schema={OVERRIDES_SCHEMA.rf_degrading_threshold} />
            <OverrideControl label="Failure Threshold" value={rfFailure} onChange={setRfFailure} schema={OVERRIDES_SCHEMA.rf_failure_threshold} />
        </div>
    );
    
    const xgbOverrides = <p className="text-xs text-center text-gray-500">Risk band thresholds can be adjusted in site policy settings.</p>;

    const activePanel = activeTab === 'rf' ? data.rf_explain_panel : data.xgb_explain_panel;

    return (
        <ExplainOverrideWrapper
            title="Model Internals"
            isExplainMode={isExplainMode}
            narratorText={activePanel?.narration || "Each model uses different features to determine asset health."}
            explanationContent={<StepTracePanel panel={activePanel} />}
            overrideContent={activeTab === 'rf' ? rfOverrides : xgbOverrides}
        >
            <div className="border-b border-gray-700 mt-2">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    <button onClick={() => setActiveTab('rf')} className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'rf' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>Random Forest</button>
                    <button onClick={() => setActiveTab('xgb')} className={`whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'xgb' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'}`}>XGBoost + SHAP</button>
                </nav>
            </div>
            
            <div className="pt-4 min-h-[180px]">
            {activeTab === 'rf' ? (
                <div>
                    <h4 className="text-center font-semibold text-gray-300">Tree Votes</h4>
                     <div style={{ width: '100%', height: 150 }}>
                        <ResponsiveContainer>
                            <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={70} tick={{ fill: '#d1d5db', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}/>
                                <Bar dataKey="votes" barSize={20} radius={[0, 4, 4, 0]}>
                                    {chartData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            ) : (
                 <div>
                     <h4 className="text-center font-semibold text-gray-300 mb-2">Stepwise Risk Calculation</h4>
                     <StepTracePanel panel={data.xgb_explain_panel} />
                 </div>
            )}
            </div>
        </ExplainOverrideWrapper>
    );
};