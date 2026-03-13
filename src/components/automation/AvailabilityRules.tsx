"use client";

import { useState, useEffect } from "react";
import { Clock, Info, Save, Loader2, CheckCircle2 } from "lucide-react";
import { getClinicSettings, updateClinicSettings } from "@/lib/actions";

const DAYS = [
    { id: "monday", label: "Lunes" },
    { id: "tuesday", label: "Martes" },
    { id: "wednesday", label: "Miércoles" },
    { id: "thursday", label: "Jueves" },
    { id: "friday", label: "Viernes" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
];

interface DaySchedule {
    isOpen: boolean;
    start: string;
    end: string;
}

interface Availability {
    [key: string]: DaySchedule;
}

export function AvailabilityRules() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [availability, setAvailability] = useState<Availability>({
        monday: { isOpen: true, start: "09:00", end: "20:00" },
        tuesday: { isOpen: true, start: "09:00", end: "20:00" },
        wednesday: { isOpen: true, start: "09:00", end: "20:00" },
        thursday: { isOpen: true, start: "09:00", end: "20:00" },
        friday: { isOpen: true, start: "09:00", end: "20:00" },
        saturday: { isOpen: true, start: "09:00", end: "14:00" },
        sunday: { isOpen: false, start: "09:00", end: "14:00" },
    });

    const [rules, setRules] = useState({
        minLeadTime: "1",
        maxAdvanceBooking: "1",
    });

    useEffect(() => {
        async function loadSettings() {
            const settings = await getClinicSettings();
            if (settings) {
                if (settings.availability) {
                    setAvailability(settings.availability as Availability);
                }
                if (settings.appointmentRules) {
                    setRules(settings.appointmentRules as any);
                }
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleToggleDay = (dayId: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], isOpen: !prev[dayId].isOpen }
        }));
    };

    const handleTimeChange = (dayId: string, field: "start" | "end", value: string) => {
        setAvailability(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], [field]: value }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const result = await updateClinicSettings({
                availability,
                appointmentRules: rules
            });
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                alert("Error al guardar la configuración");
            }
        } catch (error) {
            console.error("Error saving availability:", error);
            alert("Error al conectar con el servidor");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={24} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Horarios y Disponibilidad</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Controla cuándo el bot y el formulario público pueden agendar citas.
                    </p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg ${
                        showSuccess 
                        ? "bg-green-500 text-white shadow-green-200" 
                        : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                    }`}
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : showSuccess ? (
                        <CheckCircle2 size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    {showSuccess ? "Guardado" : "Guardar configuración"}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Schedule */}
                <div className="space-y-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Horario Semanal</h3>
                    <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-6 space-y-4">
                        {DAYS.map((day) => {
                            const schedule = availability[day.id];
                            return (
                                <div key={day.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3 w-32">
                                        <div 
                                            onClick={() => handleToggleDay(day.id)}
                                            className={`w-10 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                                                schedule.isOpen ? "bg-green-500" : "bg-gray-200"
                                            }`}
                                        >
                                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                                                schedule.isOpen ? "right-1" : "left-1"
                                            }`} />
                                        </div>
                                        <span className={`text-sm font-medium ${schedule.isOpen ? "text-gray-900" : "text-gray-400"}`}>
                                            {day.label}
                                        </span>
                                    </div>

                                    {schedule.isOpen ? (
                                        <div className="flex items-center gap-3 animate-in fade-in duration-300">
                                            <TimeInput 
                                                value={schedule.start} 
                                                onChange={(v) => handleTimeChange(day.id, "start", v)} 
                                            />
                                            <span className="text-gray-300 font-medium">a</span>
                                            <TimeInput 
                                                value={schedule.end} 
                                                onChange={(v) => handleTimeChange(day.id, "end", v)} 
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400 italic font-medium px-4 py-1.5 bg-gray-100 rounded-lg">
                                            Cerrado (Día no laboral)
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Rules & Exceptions */}
                <div className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Reglas de Agendamiento</h3>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 flex gap-4">
                            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-xl h-fit">
                                <Info size={20} />
                            </div>
                            <div className="text-sm">
                                <p className="font-bold text-blue-900 mb-1">Pausa Inteligente</p>
                                <p className="text-blue-800 leading-relaxed opacity-80">El sistema deja automáticamente <strong>10 minutos</strong> entre citas para limpieza y preparación.</p>
                            </div>
                        </div>

                        <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-6 shadow-sm">
                            <div className="flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-bold text-gray-900">Antelación mínima</label>
                                    <p className="text-xs text-gray-500">¿Con cuánto tiempo de aviso quieres que reserven?</p>
                                </div>
                                <select 
                                    value={rules.minLeadTime}
                                    onChange={(e) => setRules({ ...rules, minLeadTime: e.target.value })}
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer hover:bg-gray-100"
                                >
                                    <option value="1">1 hora</option>
                                    <option value="4">4 horas</option>
                                    <option value="24">24 horas</option>
                                    <option value="48">48 horas</option>
                                </select>
                            </div>

                            <div className="flex justify-between items-center group">
                                <div className="space-y-0.5">
                                    <label className="text-sm font-bold text-gray-900">Límite de futuro</label>
                                    <p className="text-xs text-gray-500">¿Hasta cuándo en el futuro pueden reservar?</p>
                                </div>
                                <select 
                                    value={rules.maxAdvanceBooking}
                                    onChange={(e) => setRules({ ...rules, maxAdvanceBooking: e.target.value })}
                                    className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm font-bold text-gray-700 outline-none focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer hover:bg-gray-100"
                                >
                                    <option value="1">1 mes</option>
                                    <option value="2">2 meses</option>
                                    <option value="3">3 meses</option>
                                    <option value="6">6 meses</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="relative group">
            <input
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 w-24 transition-all hover:border-gray-300"
            />
        </div>
    );
}
