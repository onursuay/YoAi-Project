
export type ScreenId = 
  | 'login'
  | 'dashboard'
  | 'meta-overview'
  | 'meta-accounts'
  | 'meta-campaigns'
  | 'meta-adsets'
  | 'meta-ads'
  | 'meta-reports'
  | 'google-overview'
  | 'google-accounts'
  | 'google-campaigns'
  | 'google-adgroups'
  | 'google-ads'
  | 'google-keywords'
  | 'google-reports'
  | 'seo-overview'
  | 'seo-keywords'
  | 'seo-technical'
  | 'seo-content'
  | 'settings'
  | 'support'
  | 'privacy'
  | 'data-deletion'
  | 'insights-cross'
  | 'insights-meta'
  | 'insights-google';

export interface CampaignData {
  id: string;
  name: string;
  status: 'Active' | 'Paused' | 'Archived';
  budget: string;
  spend: string;
  results: number;
}

export interface AccountData {
  id: string;
  name: string;
  status: string;
}
