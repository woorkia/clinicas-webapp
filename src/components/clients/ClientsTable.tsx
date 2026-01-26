"use client";

import { MoreHorizontal, MessageSquare, Calendar, Phone } from "lucide-react";
import { clsx } from "clsx";

const clients = [
    {
        id: 1,
        name: "Juan Pérez",
        phone: "+34 600 123 456",
        email: "juan.perez@email.com",
        lastVisit: "26 Ene 2026",
        totalVisits: 8,
        status: "active",
        tags: ["BMS NAZAR", "Vip"]
    },
    {
        id: 2,
        name: "Ana García",
        phone: "+34 612 345 678",
        email: "ana.g@email.com",
        lastVisit: "15 Dic 2025",
        totalVisits: 3,
        status: "active",
        tags: ["Facial"]
    },
    {
        id: 3,
        name: "Carlos López",
        phone: "+34 699 888 777",
        email: "-",
        lastVisit: "01 Nov 2025",
        totalVisits: 1,
        status: "inactive",
        tags: ["Corporal"]
    },
    {
        id: 4,
        name: "María Rodríguez",
        phone: "+34 655 443 322",
        email: "maria.rod@email.com",
        lastVisit: "20 Ene 2026",
        totalVisits: 12,
        status: "active",
        tags: ["Recurrente", "Antiaging"]
    },
    {
        id: 5,
        name: "Pedro Sánchez",
        phone: "+34 666 000 111",
        email: "pedro.s@email.com",
        lastVisit: "-",
        totalVisits: 0,
        status: "lead",
        tags: ["Nuevo"]
    },
];

export function ClientsTable() {
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
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                        {client.name.split(" ").map(n => n[0]).join("").substring(0, 2)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{client.name}</p>
                                        <div className="flex gap-1 mt-1">
                                            {client.tags.map(tag => (
                                                <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                                    {tag}
                                                </span>
                                            ))}
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
                                    {client.email !== "-" && (
                                        <p className="text-gray-500 pl-6 text-xs">{client.email}</p>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={clsx(
                                    "px-2.5 py-1 rounded-full text-xs font-medium border",
                                    client.status === "active" && "bg-green-50 text-green-700 border-green-100",
                                    client.status === "inactive" && "bg-gray-100 text-gray-600 border-gray-200",
                                    client.status === "lead" && "bg-blue-50 text-blue-700 border-blue-100"
                                )}>
                                    {client.status === "active" ? "Activo" : client.status === "lead" ? "Lead Nuevo" : "Inactivo"}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {client.lastVisit}
                            </td>
                            <td className="px-6 py-4 text-center">
                                <span className="font-medium text-gray-900">{client.totalVisits}</span>
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
                    ))}
                </tbody>
            </table>
        </div>
    );
}
