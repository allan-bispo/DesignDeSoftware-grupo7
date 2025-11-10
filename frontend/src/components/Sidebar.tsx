import { LayoutDashboard, BookOpen, Users, BarChart3, FlaskConical } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const testItem = {
    id: 'test-query',
    label: 'Test React Query',
    icon: FlaskConical,
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">CF</span>
          </div>
          <span className="font-semibold text-lg">CourseFlow</span>
        </div>
      </div>
      
      <nav className="p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}

        {import.meta.env.MODE === 'development' && (
          <>
            <div className="my-4 border-t border-gray-200"></div>
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
              Development
            </div>
            <button
              onClick={() => onTabChange(testItem.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                activeTab === testItem.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <testItem.icon size={20} />
              <span className="font-medium">{testItem.label}</span>
            </button>
          </>
        )}
      </nav>
    </aside>
  );
}
