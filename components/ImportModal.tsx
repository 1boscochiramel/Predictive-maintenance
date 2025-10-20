import React, { useState, useMemo } from 'react';
import { REFINERY_UNITS } from '../constants';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunAnalysis: (assetId: string, importMode: 'PHD' | 'CSV') => void;
}

type Tab = 'phd' | 'csv';

const selectStyles = "bg-gray-800 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-colors disabled:opacity-50";
const buttonStyles = "w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-3 text-center transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center";

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onRunAnalysis }) => {
  const [activeTab, setActiveTab] = useState<Tab>('phd');
  const [selectedUnit, setSelectedUnit] = useState<string>(Object.keys(REFINERY_UNITS)[0]);
  const [selectedAsset, setSelectedAsset] = useState<string>(REFINERY_UNITS[Object.keys(REFINERY_UNITS)[0]][0]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchStatus, setFetchStatus] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);

  const availableAssets = useMemo(() => REFINERY_UNITS[selectedUnit] || [], [selectedUnit]);
  
  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setSelectedUnit(newUnit);
    setSelectedAsset(REFINERY_UNITS[newUnit][0]);
  };

  const handleFetch = async () => {
    setIsFetching(true);
    setFetchStatus('Connecting to historian...');
    await new Promise(res => setTimeout(res, 700));
    setFetchStatus(`Reading tags for ${selectedAsset}...`);
    await new Promise(res => setTimeout(res, 1000));
    setFetchStatus('Validating timestamps...');
    await new Promise(res => setTimeout(res, 500));
    setIsFetching(false);
    onRunAnalysis(selectedAsset, 'PHD');
  };
  
  const handleUpload = async (file: File) => {
    if (!file) return;
    setFileName(file.name);
    setIsFetching(true);
    setFetchStatus('Parsing CSV file...');
    await new Promise(res => setTimeout(res, 700));
    setFetchStatus('Auto-mapping columns...');
    await new Promise(res => setTimeout(res, 800));
    setFetchStatus('Checking data quality...');
    await new Promise(res => setTimeout(res, 500));
    setIsFetching(false);
    onRunAnalysis(selectedAsset, 'CSV');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Import Sensor Data</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <label htmlFor="unit-select-modal" className="block mb-2 text-sm font-medium text-gray-300">Refinery Unit</label>
                    <select id="unit-select-modal" value={selectedUnit} onChange={handleUnitChange} className={selectStyles} disabled={isFetching}>
                        {Object.keys(REFINERY_UNITS).map(unit => <option key={unit} value={unit}>{unit}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="asset-select-modal" className="block mb-2 text-sm font-medium text-gray-300">Equipment Asset</label>
                    <select id="asset-select-modal" value={selectedAsset} onChange={e => setSelectedAsset(e.target.value)} className={selectStyles} disabled={isFetching}>
                        {availableAssets.map(asset => <option key={asset} value={asset}>{asset}</option>)}
                    </select>
                </div>
            </div>

            <div className="border-b border-gray-600 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    <button onClick={() => setActiveTab('phd')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'phd' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}>From Honeywell PHD</button>
                    <button onClick={() => setActiveTab('csv')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'csv' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-300'}`}>Upload CSV File</button>
                </nav>
            </div>

            {isFetching ? (
                 <div className="text-center p-8">
                    <svg className="animate-spin mx-auto h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="mt-4 text-gray-300">{fetchStatus}</p>
                </div>
            ) : (
                <>
                    {activeTab === 'phd' && (
                        <div>
                            <p className="text-sm text-gray-400 mb-6">Fetch live tag trends directly from the historian for the selected asset and time range.</p>
                             <button onClick={handleFetch} className={buttonStyles} disabled={!selectedAsset}>Fetch from PHD & Analyze</button>
                        </div>
                    )}
                    {activeTab === 'csv' && (
                        <div>
                            <p className="text-sm text-gray-400 mb-4">Upload a CSV file for offline or historical analysis. It must contain 'timestamp', 'tag_code', and 'value' columns.</p>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg className="mx-auto h-12 w-12 text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                    <div className="flex text-sm text-gray-400">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-cyan-400 hover:text-cyan-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-800 focus-within:ring-cyan-500">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".csv" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{fileName || 'CSV up to 10MB'}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
      </div>
    </div>
  );
};