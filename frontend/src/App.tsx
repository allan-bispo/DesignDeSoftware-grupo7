import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Library from './pages/Library';
import { initializeUserStore } from './store/useUserStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Inicializar o store na primeira renderização
  useEffect(() => {
    initializeUserStore();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'courses':
        return <Courses />;
      case 'library':
        return <Library />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
    </div>
  );
}

export default App;
