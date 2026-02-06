"use client";

import React, { useState } from 'react';

const daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());

    // Mock appointments for demo
    const appointments = [
        { id: 1, day: 2, hour: 10, client: 'María García', service: 'Limpieza Facial' },
        { id: 2, day: 2, hour: 16, client: 'Lucía López', service: 'Depilación Láser' },
        { id: 3, day: 3, hour: 11, client: 'Ana Martínez', service: 'Consulta' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Agenda de Citas</h1>
                        <p className="text-gray-500">Gestionado automáticamente por WhatsApp</p>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                        Nueva Cita Manual
                    </button>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="grid grid-cols-8 border-b border-gray-200 bg-gray-50">
                        <div className="p-4 text-center text-gray-400 font-medium">Hora</div>
                        {daysOfWeek.map((day) => (
                            <div key={day} className="p-4 text-center font-semibold text-gray-700">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="divide-y divide-gray-100">
                        {hours.map((hour) => (
                            <div key={hour} className="grid grid-cols-8 min-h-[80px]">
                                {/* Time Column */}
                                <div className="p-4 border-r border-gray-100 text-gray-500 text-sm font-medium bg-gray-50/50 flex items-center justify-center">
                                    {hour}:00
                                </div>

                                {/* Days Columns */}
                                {daysOfWeek.map((_, dayIndex) => {
                                    const appointment = appointments.find(
                                        (apt) => apt.day === dayIndex && apt.hour === hour
                                    );

                                    return (
                                        <div key={dayIndex} className="relative p-1 border-r border-gray-100 hover:bg-gray-50 transition">
                                            {appointment && (
                                                <div className="absolute inset-1 bg-blue-100 border-l-4 border-blue-500 rounded p-2 text-xs overflow-hidden hover:shadow-md cursor-pointer transition-all">
                                                    <p className="font-bold text-blue-900 truncate">{appointment.client}</p>
                                                    <p className="text-blue-700 truncate">{appointment.service}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
