"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Clock } from "lucide-react";
import { clsx } from "clsx";
import { getAppointments, getClients, getCategories } from "@/lib/actions";
import { AppointmentModal } from "@/components/calendar/AppointmentModal";
import { CalendarView } from "@/components/calendar/CalendarView";

const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8:00 to 20:00

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Get start and end of current month for filtering (plus some buffer)
                const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
                startOfMonth.setDate(startOfMonth.getDate() - 7); // Buffer for previous month days
                const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
                endOfMonth.setDate(endOfMonth.getDate() + 7); // Buffer for next month days
                
                startOfMonth.setHours(0, 0, 0, 0);
                endOfMonth.setHours(23, 59, 59, 999);

                const [appts, clis, cats] = await Promise.all([
                    getAppointments(startOfMonth, endOfMonth),
                    getClients(),
                    getCategories()
                ]);

                setAppointments(appts);
                setClients(clis);
                setCategories(cats);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentDate]);

    const nextMonth = () => {
        const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(next);
    };

    const prevMonth = () => {
        const prev = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prev);
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Agenda de Citas</h1>
                    <p className="text-sm text-gray-500 mt-1">Gestión de citas y disponibilidad de la clínica.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                    >
                        <Plus size={18} />
                        Nueva Cita Manual
                    </button>
                </div>
            </header>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden h-[800px]">
                {loading ? (
                    <div className="h-full w-full flex items-center justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                    </div>
                ) : (
                    <CalendarView 
                        appointments={appointments} 
                        currentMonth={currentDate}
                        onMonthChange={setCurrentDate}
                    />
                )}
            </div>

            <AppointmentModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                clients={clients}
                categories={categories}
            />
        </div>
    );
}
