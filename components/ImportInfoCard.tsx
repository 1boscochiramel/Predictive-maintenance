import React from 'react';
import type { ImportStatus, DataQuality } from '../types';

interface ImportInfoCardProps {
    dataSource: 'PHD' | 'CSV';
    importStatus: ImportStatus;
    dataQuality: DataQuality;
}

const MetaItem: React.FC<{ label: string; value: string | number; unit?: string }> = ({ label, value, unit }) => (
    <div className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
        <dt className="text-sm font-medium text-gray-400">{label}</dt>
        <dd className="text-sm text-gray-200 font-mono">
            {value}
            {unit && <span className="text-gray-400 ml-1">{unit}</span>}
        </dd>
    </div>
);


export const ImportInfoCard: React.FC<ImportInfoCardProps> = ({ dataSource, importStatus, dataQuality }) => {
    return (
        <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700 h-full">
            <h3 className="text-xl font-semibold text-white mb-4">Data Source & Quality</h3>
            <dl>
                <MetaItem label="Source" value={dataSource} />
                <MetaItem label="Rows Read" value={importStatus.rows_read.toLocaleString()} />
                <MetaItem label="Valid Rows" value={importStatus.valid_rows.toLocaleString()} />
                <MetaItem label="Data Quality" value={importStatus.quality_pct} unit="%" />
                <MetaItem label="Missing Data" value={dataQuality.missing_pct} unit="%" />
            </dl>
        </div>
    );
};