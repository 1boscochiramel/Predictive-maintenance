import React, { useState, useMemo } from 'react';
import { REFINERY_UNITS } from '../constants';

interface AssetSelectorProps {
  onRunAnalysis?: (assetId: string) => void; // Made optional as it's no longer the primary trigger
  isLoading: boolean;
  selectedAssetId?: string; // Can be controlled from parent
}

const selectStyles = "bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 transition-colors disabled:opacity-50";

export const AssetSelector: React.FC<AssetSelectorProps> = ({ onRunAnalysis, isLoading, selectedAssetId }) => {
  const initialUnit = selectedAssetId ? selectedAssetId.split(' ')[0] : Object.keys(REFINERY_UNITS)[0];
  const initialAsset = selectedAssetId || REFINERY_UNITS[initialUnit][0];

  const [selectedUnit, setSelectedUnit] = useState<string>(initialUnit);
  const [selectedAsset, setSelectedAsset] = useState<string>(initialAsset);

  const availableAssets = useMemo(() => REFINERY_UNITS[selectedUnit] || [], [selectedUnit]);

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newUnit = e.target.value;
    setSelectedUnit(newUnit);
    setSelectedAsset(REFINERY_UNITS[newUnit][0]);
  };

  const handleAssetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedAsset(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onRunAnalysis) {
        onRunAnalysis(selectedAsset);
    }
  };

  // This component is now primarily for display, the main action is in the Import Modal.
  // The 'Run Health Check' button could be re-enabled if re-analysis without re-import is needed.
  const isButtonDisabled = isLoading || !onRunAnalysis;

  return (
    <div className="bg-gray-800/60 p-6 rounded-xl shadow-2xl border border-gray-700">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div>
          <label htmlFor="unit-select" className="block mb-2 text-sm font-medium text-gray-300">Refinery Unit</label>
          <select id="unit-select" value={selectedUnit} onChange={handleUnitChange} className={selectStyles} disabled={isLoading}>
            {Object.keys(REFINERY_UNITS).map(unit => (
              <option key={unit} value={unit}>{unit}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asset-select" className="block mb-2 text-sm font-medium text-gray-300">Equipment Asset</label>
          <select id="asset-select" value={selectedAsset} onChange={handleAssetChange} className={selectStyles} disabled={isLoading}>
            {availableAssets.map(asset => (
              <option key={asset} value={asset}>{asset}</option>
            ))}
          </select>
        </div>
         <div>
          <label htmlFor="timerange-select" className="block mb-2 text-sm font-medium text-gray-300">Time Range</label>
          <select id="timerange-select" className={selectStyles} disabled={isLoading}>
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={isButtonDisabled}
          className="w-full text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center h-11"
          title={!onRunAnalysis ? "Please import data to run a new analysis" : ""}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : 'Run Health Check'}
        </button>
      </form>
    </div>
  );
};