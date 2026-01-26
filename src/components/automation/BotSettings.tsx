"use client";

import { Smartphone, RefreshCw, Power } from "lucide-react";

export function BotSettings() {
    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                {/* Connection Status */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Conexión con ManyChat</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Conecta tu flujo de ManyChat para recibir las citas y enviar recordatorios.
                    </p>

                    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">ManyChat API Token</label>
                            <input
                                type="password"
                                placeholder="Bearer ..."
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                            />
                            <p className="text-xs text-gray-400">
                                Puedes encontrarlo en ManyChat &gt; Settings &gt; API.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Número de WhatsApp (Business)</label>
                            <div className="flex items-center gap-3 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50">
                                <Smartphone size={18} className="text-gray-400" />
                                <span className="text-sm text-gray-900">+34 600 000 000</span>
                                <span className="ml-auto text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                    Vinculado en ManyChat
                                </span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-green-600 font-medium text-sm mb-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                Webhook Activo
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-100 p-2 rounded border border-gray-200 font-mono break-all">
                                https://clinicas-app.vercel.app/api/webhook/manychat
                                <RefreshCw size={12} className="shrink-0 cursor-pointer hover:text-primary" />
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">
                                Copia esta URL en el "External Request" de tu flujo de ManyChat.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Configuration Form */}
                <div className="space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 mb-2">Configuración General</h2>
                        <p className="text-sm text-gray-500 mb-6">Ajustes globales del comportamiento.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Nombre del Asistente</label>
                            <input
                                type="text"
                                defaultValue="Ana (IA Clínica)"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 text-primary rounded-lg">
                                    <Power size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Bot Activo</p>
                                    <p className="text-xs text-gray-500">El bot responderá automáticamente</p>
                                </div>
                            </div>

                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                    <RefreshCw size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Sincronizar CRM</p>
                                    <p className="text-xs text-gray-500">Actualizar clientes en ManyChat</p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-gray-600 hover:text-primary">
                                Sincronizar ahora
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
