import React from 'react';
import type { Explanation } from '../types';

interface ExplanationCardProps {
    explanation: Explanation;
    explanationText?: string;
}

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 0010.5 3h-4.875A1.875 1.875 0 005.625 1.5zM12 2.25a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V3A.75.75 0 0112 2.25zM13.5 12a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm-3.75 3.75a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8.25 15.75a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm3.75 1.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM8.25 19.5a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" clipRule="evenodd" />
    </svg>
);


export const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanation, explanationText }) => {
    const textToDisplay = explanationText || explanation.plain_text;
    
    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex items-start space-x-4">
                <DocumentTextIcon className="w-8 h-8 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="text-xl font-semibold text-white">AI Interpretation</h3>
                    <p className="mt-2 text-gray-300 leading-relaxed">{textToDisplay}</p>
                    <div className="mt-4">
                        <p className="text-xs text-gray-500 font-mono bg-gray-900/50 p-2 rounded-md inline-block">
                            RUL Method: {explanation.rul_equation}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};