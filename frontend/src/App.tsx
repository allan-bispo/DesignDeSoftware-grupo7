import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
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

        {/* Rotas públicas - redirecionam para /dashboard se já autenticado */}
        <Route element={<PublicRoute />}>
          <Route element={<LayoutPublico />}>
            <Route path="/login" element={<Login />} />
          </Route>
        </Route>

        {/* Rotas privadas - redirecionam para /login se não autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route element={<LayoutPrivado />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/library" element={<Library />} />
            <Route path="/team" element={<div className="p-8"><h1 className="text-2xl font-bold">Team</h1></div>} />
            <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1></div>} />
          </Route>
        </Route>

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
