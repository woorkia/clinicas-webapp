"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ArrowLeft, Clock } from "lucide-react";
import { clsx } from "clsx";

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Time slots for Day View (08:00 to 22:00)
const START_HOUR = 8;
const END_HOUR = 22;
const TIME_SLOTS = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => i + START_HOUR);

interface AppointmentData {
    id: string;
    date: Date;
    serviceName: string;
    duration: number;
    client: {
        name: string;
    }
}

interface CalendarViewProps {
    appointments: AppointmentData[];
    currentMonth?: Date;
    onMonthChange?: (date: Date) => void;
}

export function CalendarView({ appointments, currentMonth: propMonth, onMonthChange }: CalendarViewProps) {
    const [view, setView] = useState<"month" | "day">("month");
    const [internalDate, setInternalDate] = useState(new Date());
    const currentDate = propMonth || internalDate;
    
    const setCurrentDate = (date: Date) => {
        if (onMonthChange) {
            onMonthChange(date);
        } else {
            setInternalDate(date);
        }
    };

    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // --- Month View Logic ---
    const daysInMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
    ).getDate();

    const getFirstDayOfMonth = () => {
        const day = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        return day === 0 ? 6 : day - 1; // 0 (Sun) -> 6, 1 (Mon) -> 0, etc.
    };
    const firstDayOfMonth = getFirstDayOfMonth();

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDayAppointments = (day: number, monthDate: Date) => {
        return appointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate.getDate() === day &&
                appDate.getMonth() === monthDate.getMonth() &&
                appDate.getFullYear() === monthDate.getFullYear();
        });
    };

    // --- Day View Logic ---
    const handleDayClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(newDate);
        setView("day");
    };

    const prevDay = () => {
        const prev = new Date(selectedDate);
        prev.setDate(prev.getDate() - 1);
        setSelectedDate(prev);
    };

    const nextDay = () => {
        const next = new Date(selectedDate);
        next.setDate(next.getDate() + 1);
        setSelectedDate(next);
    };

    const getSelectedDayAppointments = () => {
        return appointments.filter(app => {
            const appDate = new Date(app.date);
            return appDate.getDate() === selectedDate.getDate() &&
                appDate.getMonth() === selectedDate.getMonth() &&
                appDate.getFullYear() === selectedDate.getFullYear();
        });
    };

    // Calculate position and height percentages for appointments
    const getAppointmentStyle = (app: AppointmentData) => {
        const date = new Date(app.date);
        const startMinutes = (date.getHours() - START_HOUR) * 60 + date.getMinutes();
        const totalDayMinutes = (END_HOUR - START_HOUR) * 60;

        const top = (startMinutes / totalDayMinutes) * 100;
        const height = (app.duration / totalDayMinutes) * 100;

        return {
            top: `${top}%`,
            height: `${height}%`,
        };
    };


    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/50 shrink-0">
                <div className="flex items-center gap-4">
                    {view === "day" && (
                        <button
                            onClick={() => setView("month")}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors mr-2"
                            title="Volver al mes"
                        >
                            <ArrowLeft size={18} />
                        </button>
                    )}

                    <h2 className="text-lg font-semibold text-gray-900 min-w-[200px]">
                        {view === "month" ? (
                            `${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                        ) : (
                            `${DAYS[(selectedDate.getDay() + 6) % 7]}, ${selectedDate.getDate()} de ${MONTHS[selectedDate.getMonth()]}`
                        )}
                    </h2>

                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-border">
                        <button
                            onClick={view === "month" ? prevMonth : prevDay}
                            className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                        >
                            <ChevronLeft size={18} className="text-gray-600" />
                        </button>
                        <button
                            onClick={view === "month" ? nextMonth : nextDay}
                            className="p-1 hover:bg-white rounded-md transition-colors shadow-sm"
                        >
                            <ChevronRight size={18} className="text-gray-600" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setView("month")}
                        className={clsx(
                            "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                            view === "month" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Mes
                    </button>
                    <button
                        onClick={() => {
                            setSelectedDate(new Date());
                            setView("day");
                        }}
                        className={clsx(
                            "px-3 py-1 text-xs font-medium rounded-full transition-colors",
                            view === "day" ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"
                        )}
                    >
                        Día
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-white relative">
                {view === "month" ? (
                    // --- MONTH VIEW ---
                    <>
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
                                <div key={`empty-${i}`} className="bg-gray-50/20 border-b border-r border-border/30 min-h-[120px]" />
                            ))}

                            {/* Days */}
                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                const day = i + 1;
                                const dayApps = getDayAppointments(day, currentDate);
                                const isToday = day === new Date().getDate() &&
                                    currentDate.getMonth() === new Date().getMonth() &&
                                    currentDate.getFullYear() === new Date().getFullYear();

                                return (
                                    <div
                                        key={day}
                                        onClick={() => handleDayClick(day)}
                                        className={clsx(
                                            "border-b border-r border-border/50 p-2 min-h-[120px] transition-colors relative hover:bg-gray-50/50 group cursor-pointer",
                                            isToday && "bg-blue-50/10"
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
                                                    <span className="font-semibold block">
                                                        {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    <span>{app.serviceName}</span>
                                                </div>
                                            ))}
                                            {dayApps.length > 3 && (
                                                <div className="text-[10px] text-gray-400 pl-1">
                                                    + {dayApps.length - 3} más
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    // --- DAY VIEW (Google Calendar Style) ---
                    <div className="flex h-full">
                        {/* Time Column */}
                        <div className="w-16 flex-none border-r border-gray-100 bg-white">
                            {TIME_SLOTS.map(hour => (
                                <div key={hour} className="h-20 border-b border-transparent relative text-right pr-2">
                                    <span className="text-xs text-gray-400 relative -top-2.5 bg-white">
                                        {hour}:00
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Grid Area */}
                        <div className="flex-1 relative bg-white">
                            {/* Horizontal Lines */}
                            {TIME_SLOTS.map(hour => (
                                <div key={hour} className="h-20 border-b border-gray-100" />
                            ))}

                            {/* Current Time Indicator (if today) */}
                            {selectedDate.toDateString() === new Date().toDateString() && (
                                <div
                                    className="absolute left-0 right-0 border-t-2 border-red-500 z-20 pointer-events-none"
                                    style={{
                                        top: `${((new Date().getHours() - START_HOUR) * 60 + new Date().getMinutes()) / ((END_HOUR - START_HOUR) * 60) * 100}%`
                                    }}
                                >
                                    <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full" />
                                </div>
                            )}

                            {/* Appointments */}
                            {getSelectedDayAppointments().map(app => (
                                <div
                                    key={app.id}
                                    className="absolute left-2 right-4 rounded-lg bg-primary/10 border-l-4 border-primary p-2 overflow-hidden hover:bg-primary/20 transition-colors shadow-sm cursor-pointer"
                                    style={getAppointmentStyle(app)}
                                >
                                    <div className="flex items-start gap-2">
                                        <Clock size={14} className="text-primary mt-0.5" />
                                        <div>
                                            <div className="text-sm font-semibold text-primary-900">
                                                {app.client.name}
                                            </div>
                                            <div className="text-xs text-primary-700">
                                                {app.serviceName} ({app.duration} min)
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                                                {new Date(new Date(app.date).getTime() + app.duration * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
