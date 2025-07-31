import { BarChart3, Database, FileText, MapPin, Settings, Share2, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    name: 'Dashboard',
    href: '/admin',
    icon: BarChart3,
  },
  {
    name: 'States',
    href: '/admin/states',
    icon: MapPin,
  },
  {
    name: 'Blog Posts',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: TrendingUp,
  },
  {
    name: 'Social Media',
    href: '/admin/social',
    icon: Share2,
  },
  {
    name: 'Subscribers',
    href: '/admin/subscribers',
    icon: Users,
  },
  {
    name: 'Database Test',
    href: '/admin/test-db',
    icon: Database,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-beer-cream">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-beer-amber rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">H</span>
            </div>
            <span className="font-bold text-lg text-beer-dark">Hop Harrison</span>
          </Link>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-beer-cream hover:text-beer-dark transition-colors"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Quick Stats */}
        <div className="mt-8 mx-3 p-4 bg-beer-amber/10 rounded-lg">
          <h3 className="text-sm font-medium mb-2 text-beer-dark">Quick Stats</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Posts Published:</span>
              <span className="font-medium">42</span>
            </div>
            <div className="flex justify-between">
              <span>States Covered:</span>
              <span className="font-medium">8</span>
            </div>
            <div className="flex justify-between">
              <span>Subscribers:</span>
              <span className="font-medium">1,247</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="pl-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <h1 className="text-2xl font-bold text-beer-dark">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">
                Manage your beer blog content and analytics
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Welcome back, Hop!
              </div>
              <div className="w-8 h-8 bg-beer-amber rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 