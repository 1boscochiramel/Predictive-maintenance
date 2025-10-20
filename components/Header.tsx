import React from 'react';

const GearIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 5.85c-.09.55-.443.99-.99 1.13l-2.45.54a1.875 1.875 0 00-1.636 1.636l-.54 2.45c-.14.547-.58.9-.1.13l-2.128.175a1.875 1.875 0 00-1.57 1.852c0 .916.663 1.699 1.567 1.85l2.128.175c.55.09.99.443 1.13.99l.54 2.45a1.875 1.875 0 001.636 1.636l2.45.54c.547.14.9.58 1.13 1.093l.175 2.128a1.875 1.875 0 001.852 1.57c.916 0 1.699-.663 1.85-1.567l.175-2.128c.09-.55.443-.99.99-1.13l2.45-.54a1.875 1.875 0 001.636-1.636l.54-2.45c.14-.547.58-.9 1.13-1.093l2.128-.175a1.875 1.875 0 001.57-1.852c0-.916-.663-1.699-1.567-1.85l-2.128-.175a1.875 1.875 0 00-1.13-.99l-.54-2.45a1.875 1.875 0 00-1.636-1.636l-2.45-.54a1.875 1.875 0 00-1.13-1.093L13.05 3.817a1.875 1.875 0 00-1.85-1.567h-.122zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
  </svg>
);

interface HeaderProps {
    onImportClick: () => void;
    onShowTagsClick: () => void;
    onShowDashboardClick: () => void;
    currentView: 'dashboard' | 'tagRegistry';
}

export const Header: React.FC<HeaderProps> = ({ onImportClick, onShowTagsClick, onShowDashboardClick, currentView }) => {
  const navButtonStyle = "px-4 py-2 text-sm font-medium rounded-md transition-colors ";
  const activeNavStyle = "text-white bg-gray-700";
  const inactiveNavStyle = "text-gray-400 hover:bg-gray-700 hover:text-white";

  return (
    <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <GearIcon className="w-8 h-8 text-cyan-400 animate-spin-slow" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-100 tracking-wider">
              Predictive Maintenance <span className="text-cyan-400">AI</span>
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-800 p-1 rounded-lg flex space-x-1">
                <button onClick={onShowDashboardClick} className={`${navButtonStyle} ${currentView === 'dashboard' ? activeNavStyle : inactiveNavStyle}`}>Dashboard</button>
                <button onClick={onShowTagsClick} className={`${navButtonStyle} ${currentView === 'tagRegistry' ? activeNavStyle : inactiveNavStyle}`}>Tag Registry</button>
            </div>
            <button
              onClick={onImportClick}
              className="text-white bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
            >
              Import Data
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};