import { Outlet } from 'react-router-dom';

export default function LayoutPublico() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Outlet />
    </div>
  );
}
