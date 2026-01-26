"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut 
} from "lucide-react";
import { clsx } from "clsx";

const menuItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendar", label: "Calendario", icon: Calendar },
  { href: "/automation", label: "Automatización", icon: MessageSquare },
  { href: "/clients", label: "Clientes", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 bg-card border-r border-border flex flex-col shadow-sm z-30 hidden md:flex">
      {/* Logo Area */}
      <div className="p-6 border-b border-border/50">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Clínicas Llenas
        </h1>
        <p className="text-xs text-muted-foreground mt-1 text-gray-500">
          Panel de Administración
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon 
                size={20} 
                className={clsx(
                  "transition-colors",
                  isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"
                )} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-border/50 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings size={20} className="text-gray-400" />
          Configuración
        </Link>
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left">
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
