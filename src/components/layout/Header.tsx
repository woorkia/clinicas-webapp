"use client";

import { Bell, Search, Menu } from "lucide-react";

export function Header() {
    return (
        <header className="h-16 px-6 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between sticky top-0 z-20">
            {/* Mobile Menu Toggle & Search */}
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <Menu size={20} />
                </button>

                <div className="relative hidden sm:block">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="pl-9 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-64 transition-all"
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

                <button className="flex items-center gap-3 p-1.5 pr-3 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-200">
                    <div className="w-8 h-8 bg-gradient-to-tr from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                        CL
                    </div>
                    <div className="text-left hidden md:block">
                        <p className="text-sm font-medium text-gray-900 leading-none">Clínica Demo</p>
                        <p className="text-xs text-gray-500 mt-1 leading-none">Admin</p>
                    </div>
                </button>
            </div>
        </header>
    );
}
