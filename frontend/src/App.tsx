import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LayoutPrivado from './layouts/LayoutPrivado';
import LayoutPublico from './layouts/LayoutPublico';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Library from './pages/Library';
import { initializeUserStore } from './store/useUserStore';

function App() {
  useEffect(() => {
    initializeUserStore();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona a raiz para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rotas públicas com LayoutPublico */}
        <Route element={<LayoutPublico />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Rotas privadas com LayoutPrivado */}
        <Route element={<LayoutPrivado />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/library" element={<Library />} />
          <Route path="/team" element={<div className="p-8"><h1 className="text-2xl font-bold">Team</h1></div>} />
          <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
        </Route>

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
