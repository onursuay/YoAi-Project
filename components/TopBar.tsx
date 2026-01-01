'use client';

import React from 'react';
import { ICONS } from '../constants';
import { useApp } from '../app/providers';

const TopBar: React.FC = () => {
  const {
    isMetaConnected,
    isGoogleConnected,
    selectedMetaAccount,
    selectedGoogleAccount,
    setMetaConnected,
    setGoogleConnected,
  } = useApp();

  return (
    <header className="h-20 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isMetaConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-400">Meta {isMetaConnected ? 'Connected' : 'Disconnected'}</span>
          {isMetaConnected && selectedMetaAccount && (
            <div className="bg-[#1a1a1a] px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-[#222]">
              {selectedMetaAccount}
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-[#222]"></div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isGoogleConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-400">Google {isGoogleConnected ? 'Connected' : 'Disconnected'}</span>
          {isGoogleConnected && selectedGoogleAccount && (
            <div className="bg-[#1a1a1a] px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-[#222]">
              {selectedGoogleAccount}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {!isMetaConnected ? (
          <button 
            onClick={() => { window.location.href = '/api/meta/oauth'; }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0070f3] rounded-lg text-xs font-semibold hover:bg-[#0070f3]/90 transition-all shadow-[0_4px_10px_rgba(0,112,243,0.2)]"
          >
            {ICONS.Connect}
            <span>Connect Meta</span>
          </button>
        ) : (
          <button 
            onClick={() => setMetaConnected(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all"
          >
            {ICONS.Disconnect}
            <span>Disconnect Meta</span>
          </button>
        )}

        {!isGoogleConnected ? (
          <button 
            onClick={() => { window.location.href = '/api/google/oauth'; }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0070f3] rounded-lg text-xs font-semibold hover:bg-[#0070f3]/90 transition-all shadow-[0_4px_10px_rgba(0,112,243,0.2)]"
          >
            {ICONS.Connect}
            <span>Connect Google</span>
          </button>
        ) : (
          <button 
            onClick={() => setGoogleConnected(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all"
          >
            {ICONS.Disconnect}
            <span>Disconnect Google</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;
