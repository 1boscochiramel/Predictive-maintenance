import React from 'react';
import type { AssetTagSummary } from '../types';
import { TAG_REGISTRY } from '../constants';

interface AssetTagSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  summary: AssetTagSummary;
}

const tagDescriptionLookup = new Map(TAG_REGISTRY.map(t => [t.tag, t.description]));

export const AssetTagSummaryModal: React.FC<AssetTagSummaryModalProps> = ({ isOpen, onClose, summary }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl border border-gray-700 flex flex-col" style={{maxHeight: '90vh'}} onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Asset Tag Summary</h2>
                        <p className="text-cyan-400 font-mono">{summary.asset_id}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl">&times;</button>
                </div>
                
                <div className="p-6 flex-shrink-0">
                    <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                        <div>
                            <span className="text-sm text-gray-400">Tag Source</span>
                            <p className={`text-lg font-semibold ${summary.auto_filled ? 'text-yellow-400' : 'text-green-400'}`}>
                                {summary.auto_filled ? 'Auto-Filled from Import' : 'Manual Registry'}
                            </p>
                        </div>
                         <div>
                            <span className="text-sm text-gray-400">Total Tags</span>
                            <p className="text-lg font-semibold text-white">{summary.tags.length}</p>
                        </div>
                        <div>
                            <span className="text-sm text-gray-400">Sensor Coverage</span>
                            <p className={`text-lg font-semibold ${summary.coverage_pct === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {summary.coverage_pct}%
                                {summary.coverage_pct < 100 && <span className="text-xs ml-2">(Incomplete)</span>}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto px-6 pb-6">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-300 uppercase bg-gray-700/50 sticky top-0">
                            <tr>
                                <th scope="col" className="py-3 px-6">Parameter Type</th>
                                <th scope="col" className="py-3 px-6">Tag Code</th>
                                <th scope="col" className="py-3 px-6">Sensor Location</th>
                                <th scope="col" className="py-3 px-6">Unit</th>
                                <th scope="col" className="py-3 px-6">Source</th>
                                <th scope="col" className="py-3 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {summary.tags.map(tag => (
                                <tr key={tag.tag} className="bg-gray-800/80 border-b border-gray-700 hover:bg-gray-700/60 transition-colors">
                                    <td className="py-4 px-6 capitalize">{tag.type}</td>
                                    <td 
                                        className="py-4 px-6 font-mono text-cyan-400 cursor-help"
                                        title={tagDescriptionLookup.get(tag.tag) || 'No description available.'}
                                    >
                                        {tag.tag}
                                    </td>
                                    <td className="py-4 px-6">{tag.location}</td>
                                    <td className="py-4 px-6">{tag.unit}</td>
                                    <td className="py-4 px-6 capitalize">
                                        <span className={`px-2 py-1 text-xs rounded-full ${tag.source === 'manual' ? 'bg-green-900/70 text-green-300' : 'bg-yellow-900/70 text-yellow-300'}`}>
                                            {tag.source}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6">
                                        <span className="text-green-400 font-semibold">Active</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};