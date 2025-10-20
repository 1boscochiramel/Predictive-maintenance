import React, { useState, useEffect, useMemo } from 'react';
import type { PdmAnalysis, HealthState } from '../types';
import { ExplainOverrideWrapper } from './ExplainOverrideWrapper';
import { OverrideControl } from './OverrideControl';
import { OVERRIDES_SCHEMA } from '../constants';

interface RulGaugeProps {
  data: PdmAnalysis;
  isExplainMode: boolean;
}

const statusConfig = {
    Healthy: { color: '#2ECC71' },
    Degrading: { color: '#F1C40F' },
    Failure: { color: '#E74C3C' },
};

const MAX_RUL_DAYS = 120; // Set a practical maximum for gauge visualization

const parseResult = (result: string | number | undefined): number => {
    if (typeof result === 'number') return result;
    if (typeof result === 'string') {
        return parseFloat(result.split(' ')[0]);
    }
    return 0;
};

const formatValue = (value: any) => {
    if (typeof value === 'number') return value.toFixed(2);
    if (typeof value === 'object' && value !== null) {
        return Object.entries(value).map(([k,v]) => `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`).join(', ');
    }
    return value;
}

export const RulGauge: React.FC<RulGaugeProps> = ({ data, isExplainMode }) => {
    const [limitL, setLimitL] = useState(OVERRIDES_SCHEMA.limit_L_mm_s.default);
    
    const initialValues = useMemo(() => {
        const steps = data.explain_panel?.steps || [];
        return {
            current: parseResult(steps.find(s => s.desc.includes('Combine to RMS'))?.result),
            slope: parseResult(steps.find(s => s.desc.includes('Fit robust trend'))?.result),
        };
    }, [data.explain_panel]);

    const [currentVal, setCurrentVal] = useState(initialValues.current);
    const [slope, setSlope] = useState(initialValues.slope);

    const calculatedRul = useMemo(() => {
        if (slope <= 0) return 999; // Avoid division by zero or negative slope
        const hours = (limitL - currentVal) / slope;
        return Math.max(0, Math.round(hours / 24));
    }, [limitL, currentVal, slope]);

    useEffect(() => {
        const limitStep = data.explain_panel?.steps?.find(s => s.desc.includes('Limit'))?.result;
        setLimitL(limitStep ? parseResult(limitStep as string) : OVERRIDES_SCHEMA.limit_L_mm_s.default);
        setCurrentVal(initialValues.current);
        setSlope(initialValues.slope);
    }, [data, initialValues]);
    
    const days = isExplainMode ? calculatedRul : data.RUL_days;
    const color = statusConfig[data.health_state].color;
    const percentage = Math.min(100, (days / MAX_RUL_DAYS) * 100);
    const circumference = 2 * Math.PI * 45; // r = 45
    const offset = circumference - (percentage / 100) * circumference;

    const explanationContent = (
        <div className="space-y-2 text-sm">
            {data.explain_panel?.steps.map(step => (
                <div key={step.step} className="p-2 bg-gray-900/50 rounded">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">{step.step}. {step.desc}</span>
                        {step.formula && <code className="text-cyan-300 font-mono text-xs">{step.formula}</code>}
                    </div>
                    <div className="text-right mt-1">
                       {step.values && <p className="text-xs text-gray-500 font-mono">{formatValue(step.values)}</p>}
                       <p className="font-semibold text-gray-200 text-base">{formatValue(step.result)} {step.units}</p>
                    </div>
                </div>
            ))}
            {data.explain_panel?.narration && (
                 <p className="text-center pt-2 text-xs text-gray-400 italic bg-gray-900 p-2 rounded-md">
                    {data.explain_panel.narration}
                 </p>
            )}
        </div>
    );

    const overrideContent = (
         <div className="space-y-4">
            <OverrideControl
                label="Vibration Limit (L)"
                value={limitL}
                onChange={setLimitL}
                schema={OVERRIDES_SCHEMA.limit_L_mm_s}
            />
             {/* Note: In a real app, trend window would require re-fetching data and recalculating slope. Here we simulate it. */}
             <OverrideControl
                label="Trend Window"
                value={OVERRIDES_SCHEMA.trend_window_h.default}
                onChange={()=>{}}
                schema={OVERRIDES_SCHEMA.trend_window_h}
                disabled={true}
            />
        </div>
    );
    
    return (
        <ExplainOverrideWrapper
            title="Remaining Useful Life"
            isExplainMode={isExplainMode}
            narratorText="Fitting a robust trend to recent sensor data to project when the vibration limit (L) will be crossed."
            explanationContent={explanationContent}
            overrideContent={overrideContent}
        >
            <div className="flex flex-col items-center justify-center h-full pt-4">
                <div className="relative w-40 h-40">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle className="stroke-current text-gray-700" strokeWidth="10" cx="50" cy="50" r="45" fill="transparent" transform="rotate(-90 50 50)" />
                        <circle className="transition-all duration-1000 ease-out" strokeWidth="10" strokeLinecap="round" cx="50" cy="50" r="45" fill="transparent" strokeDasharray={circumference} style={{ strokeDashoffset: offset, stroke: color }} transform="rotate(-90 50 50)" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold" style={{ color: color }}>{days}</span>
                        <span className="text-lg text-gray-300">days</span>
                    </div>
                </div>
                {data.RUL_ci_days && (
                    <p className="text-sm text-gray-500 mt-4">
                        95% CI: [{data.RUL_ci_days[0]}, {data.RUL_ci_days[1]}] days
                    </p>
                )}
            </div>
        </ExplainOverrideWrapper>
    );
};