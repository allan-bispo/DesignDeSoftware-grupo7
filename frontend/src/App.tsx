import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import RoleGuard from './components/RoleGuard';
import LayoutPrivado from './layouts/LayoutPrivado';
import LayoutPublico from './layouts/LayoutPublico';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Library from './pages/Library';
import UserManagement from './pages/UserManagement';
import { initializeUserStore } from './store/useUserStore';

// Páginas AKCIT - Nova Arquitetura
import MicrocourseList from './pages/PedagogicalProject/MicrocourseList';
import LearningTrails from './pages/PedagogicalProject/LearningTrails';
import ThematicAreas from './pages/PedagogicalProject/ThematicAreas';
import Teams from './pages/TeamManagement/Teams';
import Tasks from './pages/TeamManagement/Tasks';
import Ebooks from './pages/ContentProduction/Ebooks';

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

            {/* Rotas Legacy */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/library" element={<Library />} />

            {/* AKCIT - Projeto Pedagógico */}
            <Route path="/microcourses" element={<MicrocourseList />} />
            <Route path="/learning-trails" element={<LearningTrails />} />
            <Route path="/thematic-areas" element={<ThematicAreas />} />

            {/* AKCIT - Gestão de Equipes */}
            <Route path="/teams" element={<Teams />} />
            <Route path="/tasks" element={<Tasks />} />

            {/* AKCIT - Produção de Conteúdo */}
            <Route path="/ebooks" element={<Ebooks />} />
            <Route path="/videos" element={<div className="p-8"><h1 className="text-2xl font-bold">Videoaulas</h1></div>} />
            <Route path="/materials" element={<div className="p-8"><h1 className="text-2xl font-bold">Materiais Didáticos</h1></div>} />

            {/* AKCIT - AVA */}
            <Route path="/classes" element={<div className="p-8"><h1 className="text-2xl font-bold">Turmas</h1></div>} />
            <Route path="/forums" element={<div className="p-8"><h1 className="text-2xl font-bold">Fóruns</h1></div>} />

            {/* AKCIT - Estudantes */}
            <Route path="/students" element={<div className="p-8"><h1 className="text-2xl font-bold">Alunos</h1></div>} />
            <Route path="/interventions" element={<div className="p-8"><h1 className="text-2xl font-bold">Intervenções</h1></div>} />

            {/* AKCIT - Eventos e Certificados */}
            <Route path="/events" element={<div className="p-8"><h1 className="text-2xl font-bold">Eventos</h1></div>} />
            <Route path="/certificates" element={<div className="p-8"><h1 className="text-2xl font-bold">Certificados</h1></div>} />

            <Route path="/analytics" element={<div className="p-8"><h1 className="text-2xl font-bold">Analytics</h1></div>} />

            {/* Rotas protegidas por role - Apenas Admin */}
            <Route element={<RoleGuard allowedRoles={['admin']} />}>
              <Route path="/user-management" element={<UserManagement />} />
            </Route>
          </Route>
        </Route>

        {/* Rota para páginas não encontradas */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
