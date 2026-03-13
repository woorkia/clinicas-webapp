"use client";

import { useEffect, useState } from "react";
import { getClientHistory } from "@/lib/actions";
import { 
    Clock, 
    X, 
    Calendar, 
    CreditCard, 
    Stethoscope, 
    ExternalLink,
    AlertCircle,
    Loader2
} from "lucide-react";
import { clsx } from "clsx";

interface ClientHistoryProps {
    client: any;
    onClose: () => void;
}

export function ClientHistory({ client, onClose }: ClientHistoryProps) {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadHistory() {
            const data = await getClientHistory(client.id);
            setAppointments(data);
            setLoading(false);
        }
        loadHistory();
    }, [client.id]);

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getTotalInvested = () => {
        return appointments.reduce((sum, app) => sum + (app.servicePrice || 0), 0);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/30">
                                {client.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2)}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">{client.name}</h3>
                                <p className="text-blue-100 text-sm flex items-center gap-1">
                                    <Clock size={14} /> Historial Clínico Completo
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Stats Summary */}
                <div className="grid grid-cols-3 border-b border-gray-100 divide-x divide-gray-100 bg-gray-50/50">
                    <div className="p-4 text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Citas Totales</p>
                        <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Inversión Total</p>
                        <p className="text-xl font-bold text-blue-600">{getTotalInvested()}€</p>
                    </div>
                    <div className="p-4 text-center">
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Paciente desde</p>
                        <p className="text-xl font-bold text-gray-900">
                            {new Date(client.createdAt).getFullYear()}
                        </p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-6 space-y-4 bg-[#F8FAFC]">
                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
                            <Loader2 className="animate-spin" size={32} />
                            <p className="text-sm font-medium">Cargando historial...</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                                <AlertCircle size={32} />
                            </div>
                            <div>
                                <p className="text-gray-900 font-bold">Sin actividad registrada</p>
                                <p className="text-sm text-gray-500">Este paciente aún no ha completado ninguna cita.</p>
                            </div>
                        </div>
                    ) : (
                        appointments.map((app, index) => (
                            <div 
                                key={app.id} 
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                            <Stethoscope size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                                                {app.serviceName}
                                            </h4>
                                            <div className="flex flex-wrap gap-y-1 gap-x-4 mt-1">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <Calendar size={13} className="text-gray-400" />
                                                    {formatDate(app.date)}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <CreditCard size={13} className="text-gray-400" />
                                                    {app.servicePrice}€
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                                        app.status === "CONFIRMED" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                    )}>
                                        {app.status === "CONFIRMED" ? "Completado" : "Cancelado"}
                                    </span>
                                </div>
                                {app.notes && (
                                    <div className="mt-3 pl-14 text-sm text-gray-600 italic bg-gray-50 p-3 rounded-xl border border-dashed border-gray-200">
                                        "{app.notes}"
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all text-sm"
                    >
                        Cerrar Historial
                    </button>
                </div>
            </div>
        </div>
    );
}
