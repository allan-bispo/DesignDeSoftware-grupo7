import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function LayoutPrivado() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Sidebar />
      <div className="ml-64 min-h-screen">
        <Outlet />
      </div>
    </div>
  );
}
