import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CourseListTest from './components/CourseListTest';
import { initializeUserStore, useUserStore } from './store/useUserStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    initializeUserStore();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'test-query':
        return <CourseListTest />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      {renderContent()}
      
      {import.meta.env.MODE === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-xs max-w-xs">
          <p className="font-bold mb-2">Debug Store:</p>
          <p>Autenticado: {isAuthenticated ? 'Sim' : 'Não'}</p>
          {user && <p>Usuário: {user.name}</p>}
          <button
            onClick={() => setActiveTab('test-query')}
            className="mt-2 px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700"
          >
            Teste React Query
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
