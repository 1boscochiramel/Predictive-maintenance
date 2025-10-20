import React, { useState } from 'react';

interface ExplainOverrideWrapperProps {
    title: string;
    isExplainMode: boolean;
    narratorText: string;
    explanationContent: React.ReactNode;
    overrideContent: React.ReactNode;
    children: React.ReactNode;
}

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);


export const ExplainOverrideWrapper: React.FC<ExplainOverrideWrapperProps> = ({
    title,
    isExplainMode,
    narratorText,
    explanationContent,
    overrideContent,
    children,
}) => {
    const [isExplainOpen, setIsExplainOpen] = useState(false);
    const [isOverrideOpen, setIsOverrideOpen] = useState(false);

    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-400">{title}</h3>
                {isExplainMode && (
                    <div className="group relative">
                        <InfoIcon className="w-5 h-5 text-cyan-400" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-60 bg-gray-900 text-white text-xs rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg border border-gray-700">
                           <span className="font-bold block text-cyan-300">What the AI is doing:</span>
                           {narratorText}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex-grow">
                {children}
            </div>

            {isExplainMode && (
                <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
                    {/* How It Works Section */}
                    <button onClick={() => setIsExplainOpen(!isExplainOpen)} className="flex justify-between items-center w-full text-left font-semibold text-gray-300 hover:text-white">
                        <span>📘 How It Works</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isExplainOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isExplainOpen && (
                        <div className="p-4 bg-gray-900/40 rounded-lg mt-2 text-gray-300">
                            {explanationContent}
                        </div>
                    )}
                    
                    {/* Overrides Section */}
                    <button onClick={() => setIsOverrideOpen(!isOverrideOpen)} className="flex justify-between items-center w-full text-left font-semibold text-gray-300 hover:text-white pt-2">
                        <span>⚙️ Overrides</span>
                        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOverrideOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOverrideOpen && (
                        <div className="p-4 bg-gray-900/40 rounded-lg mt-2">
                           {overrideContent}
                           <div className="text-center mt-4">
                               <button className="px-4 py-1.5 text-xs font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">Reset to Defaults</button>
                           </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
