import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { TagRegistry } from './components/TagRegistry';
import { ImportModal } from './components/ImportModal';
import { runPdmAnalysis } from './services/geminiService';
import type { PdmAnalysis } from './types';

type View = 'dashboard' | 'tagRegistry';

const App: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<PdmAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isImportModalOpen, setImportModalOpen] = useState(false);

  const handleRunAnalysis = useCallback(async (assetId: string, importMode: 'PHD' | 'CSV') => {
    if (!assetId) return;
    setIsLoading(true);
    setError(null);
    setAnalysisData(null);
    setImportModalOpen(false);
    setCurrentView('dashboard');
    try {
      const data = await runPdmAnalysis(assetId, importMode);
      setAnalysisData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openImportModal = () => setImportModalOpen(true);
  const closeImportModal = () => setImportModalOpen(false);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header 
        onImportClick={openImportModal}
        onShowTagsClick={() => setCurrentView('tagRegistry')}
        onShowDashboardClick={() => setCurrentView('dashboard')}
        currentView={currentView}
      />
      <main className="p-4 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto">
        {currentView === 'dashboard' && (
           <Dashboard
            data={analysisData}
            isLoading={isLoading}
            error={error}
            onImportClick={openImportModal}
          />
        )}
        {currentView === 'tagRegistry' && <TagRegistry />}
      </main>
      
      {isImportModalOpen && (
        <ImportModal
          isOpen={isImportModalOpen}
          onClose={closeImportModal}
          onRunAnalysis={handleRunAnalysis}
        />
      )}

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>Predictive Maintenance AI Dashboard v0.7</p>
      </footer>
    </div>
  );
};

export default App;