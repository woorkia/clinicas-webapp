"use client";

import { MoreHorizontal, MessageSquare, Calendar, Phone } from "lucide-react";
import { clsx } from "clsx";

interface ClientData {
    id: string;
    name: string;
    phone: string;
    email: string | null;
    createdAt: Date;
}

interface ClientsTableProps {
    data: ClientData[];
}

export function ClientsTable({ data }: ClientsTableProps) {
    // Helper to format date
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("es-ES", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-border">
                    <tr>
                        <th className="px-6 py-4 font-semibold text-gray-900">Cliente</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Contacto</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Estado</th>
                        <th className="px-6 py-4 font-semibold text-gray-900">Última Visita</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 text-center">Citas</th>
                        <th className="px-6 py-4 font-semibold text-gray-900 text-right">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                No hay clientes registrados aún.
                            </td>
                        </tr>
                    ) : (
                        data.map((client) => (
                            <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                                            {client.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{client.name}</p>
                                            <div className="flex gap-1 mt-1">
                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                    Cliente
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Phone size={14} className="text-gray-400" />
                                            <span>{client.phone}</span>
                                        </div>
                                        {client.email && (
                                            <p className="text-gray-500 pl-6 text-xs">{client.email}</p>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-full text-xs font-medium border",
                                        "bg-green-50 text-green-700 border-green-100"
                                    )}>
                                        Activo
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {formatDate(client.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className="font-medium text-gray-900">1</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Abrir WhatsApp">
                                            <MessageSquare size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Agendar Cita">
                                            <Calendar size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
