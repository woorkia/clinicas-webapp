"use client";

import { Clock, Info } from "lucide-react";

export function AvailabilityRules() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Horarios y Disponibilidad</h2>
                <p className="text-sm text-gray-500">
                    Controla cuándo el bot puede agendar citas en tu calendario.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Weekly Schedule */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Horario Semanal</h3>
                    <div className="space-y-2 border border-border rounded-lg p-4 bg-gray-50/30">
                        {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"].map((day) => (
                            <div key={day} className="flex items-center justify-between">
                                <span className="text-sm text-gray-700 w-24">{day}</span>
                                <div className="flex items-center gap-2">
                                    <TimeInput defaultValue="09:00" />
                                    <span className="text-gray-400">-</span>
                                    <TimeInput defaultValue="20:00" />
                                </div>
                                <div className="w-12 flex justify-end">
                                    <div className="w-9 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                        <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 mt-2">
                            <span className="text-sm text-gray-700 w-24">Sábado</span>
                            <div className="flex items-center gap-2">
                                <TimeInput defaultValue="09:00" />
                                <span className="text-gray-400">-</span>
                                <TimeInput defaultValue="14:00" />
                            </div>
                            <div className="w-12 flex justify-end">
                                <div className="w-9 h-5 bg-green-500 rounded-full relative cursor-pointer">
                                    <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-400 w-24">Domingo</span>
                            <span className="text-xs text-gray-400 italic flex-1 text-center">Cerrado</span>
                            <div className="w-12 flex justify-end">
                                <div className="w-9 h-5 bg-gray-300 rounded-full relative cursor-pointer">
                                    <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Rules & Exceptions */}
                <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Reglas de Agendamiento</h3>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3">
                        <Info className="text-blue-500 shrink-0" size={20} />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Pausa Inteligente</p>
                            <p className="opacity-90">El sistema dejará automáticamente <strong>10 minutos</strong> entre citas para limpieza y preparación.</p>
                        </div>
                    </div>

                    <div className="space-y-4 p-4 border border-border rounded-lg text-sm">
                        <div className="flex justify-between items-center">
                            <label className="text-gray-700">Tiempo mínimo de antelación</label>
                            <select className="bg-white border border-border rounded px-2 py-1 cursor-pointer">
                                <option>1 hora</option>
                                <option>4 horas</option>
                                <option>24 horas</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="text-gray-700">Antelación máxima de reserva</label>
                            <select className="bg-white border border-border rounded px-2 py-1 cursor-pointer">
                                <option>1 mes</option>
                                <option>2 meses</option>
                                <option>3 meses</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimeInput({ defaultValue }: { defaultValue: string }) {
    return (
        <div className="relative">
            <input
                type="time"
                defaultValue={defaultValue}
                className="bg-white border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-20"
            />
            <Clock size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
    )
}
