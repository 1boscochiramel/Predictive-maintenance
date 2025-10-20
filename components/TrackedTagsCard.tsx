import React from 'react';
import type { TagInfo } from '../types';

interface TrackedTagsCardProps {
    tags: TagInfo[];
}

export const TrackedTagsCard: React.FC<TrackedTagsCardProps> = ({ tags }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Tracked Tags in Model</h3>
            <div className="space-y-3">
                {tags.map(tag => (
                    <div key={tag.tag} className="p-3 bg-gray-900/50 rounded-lg border border-gray-700" title={tag.description}>
                        <div className="flex justify-between items-center">
                            <p className="font-mono text-cyan-400 text-sm">{tag.tag}</p>
                            <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full">{tag.unit}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{tag.parameter}</p>
                    </div>
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 text-center">
                These tags were the primary inputs for the current health prediction.
            </p>
        </div>
    );
};