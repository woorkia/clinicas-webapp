"use client";

import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";

const logs = [
    { id: 1, event: "incoming_message", source: "+34 600 123 456", detail: "Solicitud 'BMS NAZAR'", time: "10:42:05", status: "success" },
    { id: 2, event: "ai_response", source: "Bot", detail: "Consultando disponibilidad...", time: "10:42:07", status: "success" },
    { id: 3, event: "booking_attempt", source: "System", detail: "Slot 10:30 Viernes disponible", time: "10:42:08", status: "success" },
    { id: 4, event: "whatsapp_send", source: "API", detail: "Confirmación enviada", time: "10:42:10", status: "success" },
    { id: 5, event: "incoming_message", source: "+34 611 999 888", detail: "Mensaje de voz no reconocido", time: "09:15:22", status: "warning" },
];

export function WebhookLogs() {
    return (
        <div className="p-0">
            <div className="p-6 border-b border-border/50">
                <h2 className="text-lg font-semibold text-gray-900">Logs de Conexión</h2>
                <p className="text-sm text-gray-500">
                    Registro técnico de la comunicación entre WhatsApp/ManyChat y el Panel.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium">
                        <tr>
                            <th className="px-6 py-3">Hora</th>
                            <th className="px-6 py-3">Evento</th>
                            <th className="px-6 py-3">Origen</th>
                            <th className="px-6 py-3">Detalle</th>
                            <th className="px-6 py-3">Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-3 font-mono text-gray-500 text-xs">{log.time}</td>
                                <td className="px-6 py-3 font-medium text-gray-900">{log.event}</td>
                                <td className="px-6 py-3 text-gray-600">{log.source}</td>
                                <td className="px-6 py-3 text-gray-600 truncate max-w-xs">{log.detail}</td>
                                <td className="px-6 py-3">
                                    {log.status === "success" && <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full w-fit"><CheckCircle2 size={12} /> OK</span>}
                                    {log.status === "warning" && <span className="flex items-center gap-1 text-orange-600 text-xs font-medium bg-orange-50 px-2 py-0.5 rounded-full w-fit"><XCircle size={12} /> Warn</span>}
                                    {log.status === "error" && <span className="flex items-center gap-1 text-red-600 text-xs font-medium bg-red-50 px-2 py-0.5 rounded-full w-fit"><XCircle size={12} /> Error</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="p-4 bg-gray-50 border-t border-border flex justify-center">
                <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                    Ver todos los logs <ExternalLink size={14} />
                </button>
            </div>
        </div>
    );
}
