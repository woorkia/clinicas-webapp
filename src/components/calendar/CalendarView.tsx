"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const DAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Mock Data
const appointments = [
    { id: 1, day: 26, title: "Juan Pérez", time: "10:30", type: "Consulta" },
    { id: 2, day: 26, title: "Ana García", time: "12:00", type: "Revisión" },
    { id: 3, day: 28, title: "Carlos López", time: "09:00", type: "Consulta" },
    { id: 4, day: 28, title: "Maria R.", time: "16:45", type: "Urgencia" },
];

export function CalendarView() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
    ).getDay();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDayAppointments = (day: number) => {
        return appointments.filter(app => app.day === day && currentDate.getMonth() === 0); // Mock for Jan
    };

    return (
        <div className="flex flex-col h-full">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-gray-900 w-40">
                        {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-border">
                        <button onClick={prevMonth} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm">
                            <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                        <button onClick={nextMonth} className="p-1 hover:bg-white rounded-md transition-colors shadow-sm">
                            <ChevronRight size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded-full">Mes</span>
                    <span className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer">Semana</span>
                    <span className="px-3 py-1 text-xs font-medium text-gray-600 hover:bg-gray-50 rounded-full cursor-pointer">Día</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-7 border-b border-border/50 sticky top-0 bg-white z-10">
                    {DAYS.map(day => (
                        <div key={day} className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 auto-rows-fr min-h-[600px]">
                    {/* Empty cells for previous month */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="bg-gray-50/30 border-b border-r border-border/30 min-h-[120px]" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dayApps = getDayAppointments(day);
                        const isToday = day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                className={clsx(
                                    "border-b border-r border-border/50 p-2 min-h-[120px] transition-colors relative hover:bg-gray-50/50 group cursor-pointer",
                                    isToday && "bg-blue-50/20"
                                )}
                            >
                                <span className={clsx(
                                    "text-sm font-medium block mb-2 w-7 h-7 flex items-center justify-center rounded-full",
                                    isToday ? "bg-primary text-white" : "text-gray-700 group-hover:text-primary transition-colors"
                                )}>
                                    {day}
                                </span>

                                <div className="space-y-1.5">
                                    {dayApps.map((app) => (
                                        <div
                                            key={app.id}
                                            className="text-xs p-1.5 rounded bg-blue-100/50 border border-blue-200/50 text-blue-900 border-l-2 border-l-blue-500 truncate hover:opacity-80 transition-opacity"
                                        >
                                            <span className="font-semibold block">{app.time}</span>
                                            <span>{app.title}</span>
                                        </div>
                                    ))}
                                    {/* Add Appointment Button (Hidden by default, shown on hover) */}
                                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                                            <Plus size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// Icon helper
function Plus({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    )
}
