"use client";

import Link from "next/link";
import { 
  BarChart3, 
  Calendar, 
  Settings, 
  Users, 
  LogOut, 
  LayoutDashboard,
  Bell,
  Search,
  User,
  Plus
} from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Calendar, label: "Calendario", href: "/admin/calendar" },
    { icon: Settings, label: "Automatización", href: "/admin/automation" },
    { icon: Users, label: "Clientes", href: "/admin/clients" },
  ];

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-gray-100 flex flex-col pt-8 pb-4">
        <div className="px-6 mb-10">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Clínicas Llenas
          </h1>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
              Panel de Administración
            </p>
            <span className="px-1.5 py-0.5 bg-red-500 text-white text-[8px] font-bold rounded animate-pulse">
              V2.2 FINAL
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-blue-50 text-blue-600 font-semibold" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 pt-4 border-t border-gray-100 space-y-1">
          <Link
            href="/admin/settings"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all"
          >
            <Settings size={20} />
            <span className="text-sm">Configuración</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all">
            <LogOut size={20} />
            <span className="text-sm">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#F8FAFC]">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
          <div className="max-w-md w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:border-blue-100 focus:bg-white rounded-xl outline-none transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-gray-500 hover:bg-gray-50 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-[1px] h-8 bg-gray-100 mx-2"></div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 leading-none">Clinica Demo</p>
                <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-100">
                CL
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
