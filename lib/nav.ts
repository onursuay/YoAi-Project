import { 
  LayoutDashboard, 
  Target, 
  TrendingUp, 
  Sparkles, 
  Users, 
  Image, 
  FileText, 
  Package, 
  Search,
  Puzzle
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href?: string
  icon: React.ComponentType<{ className?: string }>
  iconPath?: string
  badge?: string
  disabled?: boolean
  children?: NavItem[]
}

export const navItems: NavItem[] = [
  {
    id: 'reklam',
    label: 'Reklam',
    icon: LayoutDashboard,
    children: [
      {
        id: 'meta',
        label: 'Meta',
        href: '/dashboard/reklam/meta',
        icon: LayoutDashboard,
        iconPath: '/platform-icons/meta.svg',
      },
      {
        id: 'google',
        label: 'Google',
        href: '/dashboard/reklam/google',
        icon: LayoutDashboard,
        iconPath: '/platform-icons/google-ads.svg',
      },
      {
        id: 'tiktok',
        label: 'TikTok',
        href: '#',
        icon: LayoutDashboard,
        iconPath: '/platform-icons/tiktok.svg',
        disabled: true,
      },
    ],
  },
  {
    id: 'strateji',
    label: 'Strateji',
    href: '/dashboard/strateji',
    icon: Target,
    badge: 'AI',
  },
  {
    id: 'optimizasyon',
    label: 'Optimizasyon',
    href: '/dashboard/optimizasyon',
    icon: TrendingUp,
    badge: 'AI',
  },
  {
    id: 'iyzai',
    label: 'IyzAi',
    href: '/dashboard/iyzai',
    icon: Sparkles,
  },
  {
    id: 'hedef-kitle',
    label: 'Hedef Kitle',
    href: '/dashboard/hedef-kitle',
    icon: Users,
    badge: 'AI',
  },
  {
    id: 'tasarim',
    label: 'Tasarım',
    href: '/dashboard/tasarim/gorsel',
    icon: Image,
    badge: 'AI',
  },
  {
    id: 'raporlar',
    label: 'Raporlar',
    href: '/dashboard/raporlar',
    icon: FileText,
  },
  {
    id: 'katalog',
    label: 'Katalog',
    href: '/dashboard/katalog',
    icon: Package,
  },
  {
    id: 'seo',
    label: 'SEO',
    href: '/dashboard/seo',
    icon: Search,
  },
  {
    id: 'entegrasyon',
    label: 'Entegrasyon',
    href: '/dashboard/entegrasyon',
    icon: Puzzle,
  },
]

