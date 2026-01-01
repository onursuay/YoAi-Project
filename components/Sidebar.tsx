'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ICONS } from '../constants';

interface DropdownItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: { path: string; label: string }[];
}

const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({
    'meta': true,
    'google': false,
    'seo': false,
    'insights': false,
    'legal': false
  });

  const toggleMenu = (id: string) => {
    setExpandedMenus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const menuItems: DropdownItem[] = [
    {
      id: 'meta',
      label: 'Meta Advertising',
      icon: ICONS.Meta,
      children: [
        { path: '/meta/overview', label: 'Overview' },
        { path: '/meta/accounts', label: 'Accounts' },
        { path: '/meta/campaigns', label: 'Campaigns' },
        { path: '/meta/adsets', label: 'Ad Sets' },
        { path: '/meta/ads', label: 'Ads' },
        { path: '/meta/reports', label: 'Reports' },
      ]
    },
    {
      id: 'google',
      label: 'Google Ads',
      icon: ICONS.Google,
      children: [
        { path: '/google/overview', label: 'Overview' },
        { path: '/google/accounts', label: 'Accounts' },
        { path: '/google/campaigns', label: 'Campaigns' },
        { path: '/google/adgroups', label: 'Ad Groups' },
        { path: '/google/ads', label: 'Ads' },
        { path: '/google/keywords', label: 'Keywords' },
        { path: '/google/reports', label: 'Reports' },
      ]
    },
    {
      id: 'seo',
      label: 'SEO',
      icon: ICONS.SEO,
      children: [
        { path: '/seo/overview', label: 'Overview' },
        { path: '/seo/keywords', label: 'Keywords' },
        { path: '/seo/technical', label: 'Technical' },
        { path: '/seo/content', label: 'Content' },
      ]
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: ICONS.Insights,
      children: [
        { path: '/insights/cross-channel', label: 'Cross-channel' },
        { path: '/insights/meta', label: 'Meta Insights' },
        { path: '/insights/google', label: 'Google Insights' },
      ]
    },
    {
      id: 'legal',
      label: 'Legal',
      icon: ICONS.Legal,
      children: [
        { path: '/legal/privacy', label: 'Privacy Policy' },
        { path: '/legal/deletion', label: 'Data Deletion' },
      ]
    }
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col h-full overflow-y-auto">
      <div className="p-6 flex items-center space-x-2">
        <div className="w-8 h-8 bg-[#0070f3] rounded-lg shadow-[0_0_15px_rgba(0,112,243,0.3)] flex items-center justify-center font-bold">Y</div>
        <span className="text-xl font-bold tracking-tight">YOAI</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2">
        <Link
          href="/dashboard"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/dashboard') ? 'bg-[#0070f3]/10 text-[#0070f3]' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}
        >
          {ICONS.Dashboard}
          <span className="text-sm font-medium">Dashboard</span>
        </Link>

        <div className="h-px bg-[#1a1a1a] my-4 mx-2"></div>

        {menuItems.map((menu) => (
          <div key={menu.id} className="space-y-1">
            <button 
              onClick={() => toggleMenu(menu.id)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-gray-400 hover:bg-[#1a1a1a] hover:text-white transition-all group"
            >
              <div className="flex items-center space-x-3">
                <span className="group-hover:text-white transition-colors">{menu.icon}</span>
                <span className="text-sm font-medium">{menu.label}</span>
              </div>
              <div className={`transition-transform duration-200 ${expandedMenus[menu.id] ? 'rotate-180' : ''}`}>
                {ICONS.Chevron}
              </div>
            </button>
            
            {expandedMenus[menu.id] && (
              <div className="ml-9 border-l border-[#1a1a1a] space-y-1 py-1">
                {menu.children.map(child => (
                  <Link
                    key={child.path}
                    href={child.path}
                    className={`w-full text-left px-4 py-2 text-xs font-medium rounded-r-md transition-all block ${isActive(child.path) ? 'text-[#0070f3] border-l-2 border-[#0070f3] bg-[#0070f3]/5' : 'text-gray-500 hover:text-gray-200'}`}
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        
        <div className="h-px bg-[#1a1a1a] my-4 mx-2"></div>
        
        <Link
          href="/settings"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/settings') ? 'text-[#0070f3] bg-[#0070f3]/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}
        >
          {ICONS.Settings}
          <span className="text-sm font-medium">Settings</span>
        </Link>
        
        <Link
          href="/support"
          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${isActive('/support') ? 'text-[#0070f3] bg-[#0070f3]/10' : 'text-gray-400 hover:bg-[#1a1a1a] hover:text-white'}`}
        >
          {ICONS.Support}
          <span className="text-sm font-medium">Support</span>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-[#1a1a1a] mt-auto">
        <div className="flex items-center space-x-3 p-2">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-xs border border-[#222]">JS</div>
          <div>
            <p className="text-xs font-semibold">John Sales</p>
            <p className="text-[10px] text-gray-500">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
