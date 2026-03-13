"use client";

import { MoreHorizontal, MessageSquare, Calendar, Phone, Edit2 } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";
import { ClientModal } from "./ClientModal";
import { ClientHistory } from "./ClientHistory";
import { saveClient } from "@/lib/actions";
import { Clock } from "lucide-react";

interface ClientsTableProps {
    data: any[];
}

export function ClientsTable({ data }: ClientsTableProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<any>(null);
    const [viewingHistoryClient, setViewingHistoryClient] = useState<any>(null);

    // Helper to format date
    const formatDate = (date: Date | string | undefined) => {
        if (!date) return "Sin visitas";
        return new Date(date).toLocaleDateString("es-ES", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    const handleEdit = (client: any) => {
        setEditingClient(client);
        setIsEditModalOpen(true);
    };

    const handleViewHistory = (client: any) => {
        setViewingHistoryClient(client);
    };

    const handleSave = async (updatedData: any) => {
        const result = await saveClient(updatedData);
        if (!result.success) {
            alert(result.error);
        }
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
                        data.map((client) => {
                            const lastVisit = client.appointments?.[0]?.date;
                            const appointmentsCount = client._count?.appointments || client.appointments?.length || 0;
                            const services = client.appointments?.map((a: any) => a.serviceName).join(", ") || "Ninguno";

                            return (
                                <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase">
                                                {client.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{client.name}</p>
                                                <div className="flex gap-1 mt-1">
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200" title={services}>
                                                        {services.length > 20 ? services.substring(0, 20) + "..." : services}
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
                                        {formatDate(lastVisit)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="font-medium text-gray-900">{appointmentsCount}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleViewHistory(client)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Ver Historial">
                                                <Clock size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleEdit(client)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar Cliente">
                                                <Edit2 size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Abrir WhatsApp">
                                                <MessageSquare size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            <ClientModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={handleSave}
                client={editingClient}
            />

            {viewingHistoryClient && (
                <ClientHistory 
                    client={viewingHistoryClient}
                    onClose={() => setViewingHistoryClient(null)}
                />
            )}
        </div>
    );
}
