'use client';

import React, { useEffect } from 'react';
import { ICONS } from '../constants';
import { useConnectionStore } from '@/lib/connectionStore';

const TopBar: React.FC = () => {
  const {
    metaConnected,
    googleConnected,
    metaAccountId,
    googleAccountId,
    hydrate,
    disconnectMeta,
    disconnectGoogle,
  } = useConnectionStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <header className="h-20 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-[#1a1a1a] flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${metaConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-400">Meta {metaConnected ? 'Connected' : 'Disconnected'}</span>
          {metaConnected && metaAccountId && (
            <div className="bg-[#1a1a1a] px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-[#222]">
              {metaAccountId}
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-[#222]"></div>
        
        <div className="flex items-center space-x-3">
          <div className={`w-2.5 h-2.5 rounded-full ${googleConnected ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
          <span className="text-xs font-medium text-gray-400">Google {googleConnected ? 'Connected' : 'Disconnected'}</span>
          {googleConnected && googleAccountId && (
            <div className="bg-[#1a1a1a] px-2 py-1 rounded text-[10px] font-mono text-gray-300 border border-[#222]">
              {googleAccountId}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {!metaConnected ? (
          <button 
            onClick={() => { window.location.href = '/api/meta/oauth'; }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0070f3] rounded-lg text-xs font-semibold hover:bg-[#0070f3]/90 transition-all shadow-[0_4px_10px_rgba(0,112,243,0.2)]"
          >
            {ICONS.Connect}
            <span>Connect Meta</span>
          </button>
        ) : (
          <button 
            onClick={() => disconnectMeta()}
            className="flex items-center space-x-2 px-4 py-2 bg-[#1a1a1a] border border-[#222] rounded-lg text-xs font-semibold hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 transition-all"
          >
            {ICONS.Disconnect}
            <span>Disconnect Meta</span>
          </button>
        )}

        {!googleConnected ? (
          <button 
            onClick={() => { window.location.href = '/api/google/oauth'; }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#0070f3] rounded-lg text-xs font-semibold hover:bg-[#0070f3]/90 transition-all shadow-[0_4px_10px_rgba(0,112,243,0.2)]"
          >
            {ICONS.Connect}
            <span>Connect Google</span>
          </button>
        ) : (
          <button 
            onClick={() => disconnectGoogle()}
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
