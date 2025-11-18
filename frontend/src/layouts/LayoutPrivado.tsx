import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function LayoutPrivado() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Outlet />
      </div>
    </div>
  );
}
