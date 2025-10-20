import React from 'react';

interface Schema {
    min: number;
    max: number;
    step: number;
    default: number;
    units: string;
    label: string;
    tooltip: string;
}

interface OverrideControlProps {
    label: string;
    value: number;
    onChange: (newValue: number) => void;
    schema: Schema;
    disabled?: boolean;
}

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


export const OverrideControl: React.FC<OverrideControlProps> = ({ label, value, onChange, schema, disabled = false }) => {
    return (
        <div className={`text-sm ${disabled ? 'opacity-50' : ''}`}>
            <div className="flex justify-between items-center mb-1">
                 <label className="font-medium text-gray-300 flex items-center group">
                    {label}
                     <div className="relative ml-2">
                        <InfoIcon className="w-4 h-4 text-gray-500" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-800 border border-gray-600 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                           {schema.tooltip}
                        </div>
                    </div>
                </label>
                <span className="font-mono text-cyan-300 bg-gray-700/50 px-2 py-0.5 rounded">
                    {value.toFixed(label.toLowerCase().includes('alpha') ? 2 : 1)} {schema.units}
                </span>
            </div>
            <input
                type="range"
                min={schema.min}
                max={schema.max}
                step={schema.step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                disabled={disabled}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, #22d3ee 0%, #22d3ee ${((value - schema.min) / (schema.max - schema.min)) * 100}%, #4b5563 ${((value - schema.min) / (schema.max - schema.min)) * 100}%, #4b5563 100%)`
                }}
            />
        </div>
    );
};