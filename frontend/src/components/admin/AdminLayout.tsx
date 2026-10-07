import React from "react";
import { useNavigate, Link, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Sparkles,
  Calendar,
  Scissors,
  LogOut,
  ExternalLink,
} from "lucide-react";

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-dolly-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-dolly-200 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-8">
            <Sparkles className="w-6 h-6 text-roseGold" />
            <div>
              <span className="font-serif text-lg font-bold text-dolly-900 block leading-none">
                Dolly Nail
              </span>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">
                Admin Panel
              </span>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/admin/dashboard"
              className="flex items-center space-x-3 px-4 py-3 bg-dolly-50 text-dolly-900 font-semibold rounded-2xl text-xs hover:bg-dolly-100 transition-colors"
            >
              <Calendar className="w-4 h-4 text-roseGold" />
              <span>Agendamentos</span>
            </Link>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 px-4 py-3 text-neutral-600 font-medium rounded-2xl text-xs hover:bg-dolly-50 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-neutral-400" />
              <span>Ver Site Público</span>
            </a>
          </nav>
        </div>

        <div className="pt-6 border-t border-dolly-100">
          <div className="mb-4">
            <p className="text-xs font-bold text-dolly-900">{user?.name}</p>
            <p className="text-[11px] text-neutral-500 truncate">
              {user?.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
