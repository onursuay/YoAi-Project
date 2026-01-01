
import React from 'react';
import { 
  LayoutDashboard, 
  Facebook, 
  Search, 
  Globe, 
  ShieldCheck, 
  Settings, 
  LifeBuoy,
  ChevronDown,
  User,
  Link,
  Unlink,
  Activity
} from 'lucide-react';

export const COLORS = {
  bg: '#050505',
  sidebar: '#0d0d0d',
  accent: '#0070f3',
  border: '#1a1a1a',
  card: '#111111',
  text: {
    primary: '#ffffff',
    secondary: '#999999'
  }
};

export const ICONS = {
  Dashboard: React.createElement(LayoutDashboard, { size: 18 }),
  Meta: React.createElement(Facebook, { size: 18 }),
  Google: React.createElement(Search, { size: 18 }),
  SEO: React.createElement(Globe, { size: 18 }),
  Insights: React.createElement(Activity, { size: 18 }),
  Legal: React.createElement(ShieldCheck, { size: 18 }),
  Settings: React.createElement(Settings, { size: 18 }),
  Support: React.createElement(LifeBuoy, { size: 18 }),
  Chevron: React.createElement(ChevronDown, { size: 14 }),
  User: React.createElement(User, { size: 18 }),
  Connect: React.createElement(Link, { size: 16 }),
  Disconnect: React.createElement(Unlink, { size: 16 })
};
