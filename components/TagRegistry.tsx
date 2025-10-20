import React, { useState, useMemo } from 'react';
import { TAG_REGISTRY } from '../constants';

export const TagRegistry: React.FC = () => {
    const [filter, setFilter] = useState('');

    const filteredTags = useMemo(() => {
        if (!filter) return TAG_REGISTRY;
        const lowercasedFilter = filter.toLowerCase();
        return TAG_REGISTRY.filter(tag => 
            tag.tag.toLowerCase().includes(lowercasedFilter) ||
            tag.parameter.toLowerCase().includes(lowercasedFilter) ||
            tag.description.toLowerCase().includes(lowercasedFilter) ||
            tag.asset.toLowerCase().includes(lowercasedFilter)
        );
    }, [filter]);

    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Sensor Tag Registry</h2>
                    <p className="text-gray-400 mt-1">All monitored sensor tags across refinery units.</p>
                </div>
                <div className="w-full max-w-xs">
                     <input
                        type="text"
                        placeholder="Search by tag, parameter, asset..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5"
                    />
                </div>
            </div>

            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700/50">
                        <tr>
                            <th scope="col" className="py-3 px-6">Unit</th>
                            <th scope="col" className="py-3 px-6">Asset</th>
                            <th scope="col" className="py-3 px-6">Tag Code</th>
                            <th scope="col" className="py-3 px-6">Parameter</th>
                            <th scope="col" className="py-3 px-6">Unit</th>
                            <th scope="col" className="py-3 px-6">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTags.map(tag => (
                            <tr key={tag.tag} className="bg-gray-800/80 border-b border-gray-700 hover:bg-gray-700/60 transition-colors">
                                <td className="py-4 px-6 font-medium text-white">{tag.refineryUnit}</td>
                                <td className="py-4 px-6">{tag.asset}</td>
                                <td className="py-4 px-6 font-mono text-cyan-400" title={`Category: ${tag.category}`}>{tag.tag}</td>
                                <td className="py-4 px-6">{tag.parameter}</td>
                                <td className="py-4 px-6">{tag.unit}</td>
                                <td className="py-4 px-6" title={tag.description}>{tag.description}</td>
                            </tr>
                        ))}
                         {filteredTags.length === 0 && (
                            <tr className="bg-gray-800/80 border-b border-gray-700">
                                <td colSpan={6} className="text-center py-8 text-gray-500">
                                    No tags found for "{filter}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};