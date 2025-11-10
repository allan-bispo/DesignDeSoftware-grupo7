import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import { initializeUserStore, useUserStore } from './store/useUserStore';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const user = useUserStore((state) => state.user);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  // Inicializar o store na primeira renderização
  useEffect(() => {
    initializeUserStore();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <Dashboard />
      {/* Informações de debug do store (remover em produção) */}
      {import.meta.env.MODE === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg text-xs max-w-xs">
          <p className="font-bold mb-2">Debug Store:</p>
          <p>Autenticado: {isAuthenticated ? 'Sim' : 'Não'}</p>
          {user && <p>Usuário: {user.name}</p>}
        </div>
      )}
    </div>
  );
}
