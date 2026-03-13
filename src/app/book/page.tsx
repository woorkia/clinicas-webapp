"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Clock, MapPin, Globe, ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { createBooking, getAvailableSlots } from "./actions";
import { getCategories, getClinicSettings } from "@/lib/actions";

export default function BookingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    const [settings, setSettings] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [categoriesData, settingsData] = await Promise.all([
                    getCategories(),
                    getClinicSettings()
                ]);

                // Flatten categories
                const allServices = categoriesData.flatMap((cat: any) =>
                    cat.services.map((s: any) => ({
                        ...s,
                        categoryName: cat.name,
                        price: s.price > 0 ? `${s.price}€` : "Gratis",
                        duration: `${s.duration} min`
                    }))
                );
                setServices(allServices);
                setSettings(settingsData);
            } catch (error) {
                console.error("Error loading booking data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);
    const [viewDate, setViewDate] = useState(new Date());

    const settingsData = {
        name: settings?.name || "Clínica Demo",
        address: settings?.address || "Valencia, Calle Flores n3",
        logoUrl: settings?.logoUrl || null,
        headerText: settings?.headerText || "Saca tu mejor sonrisa con nosotros 😎"
    };

    // --- CALENDAR LOGIC ---
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        // Adjust for Monday start (0=Sun -> 6, 1=Mon -> 0, ...)
        const prefixDays = firstDay === 0 ? 6 : firstDay - 1;
        
        const days = [];
        // Prefix days from prev month
        for (let i = 0; i < prefixDays; i++) {
            days.push({ day: null, currentMonth: false });
        }
        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const d = new Date(year, month, i);
            const isPast = d < new Date(new Date().setHours(0,0,0,0));
            days.push({ 
                day: i, 
                currentMonth: true, 
                date: d,
                isPast,
                isToday: d.toDateString() === new Date().toDateString(),
                isWeekend: d.getDay() === 0 || d.getDay() === 6
            });
        }
        return days;
    };

    const calendarDays = getDaysInMonth(viewDate);
    const monthName = viewDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

    const handleDateSelect = (d: Date) => {
        setSelectedDate(d.getTime());
    };

    const nextMonth = () => {
        const next = new Date(viewDate);
        next.setMonth(next.getMonth() + 1);
        setViewDate(next);
    };

    const prevMonth = () => {
        const prev = new Date(viewDate);
        // Don't go to past months
        if (prev.getMonth() === new Date().getMonth() && prev.getFullYear() === new Date().getFullYear()) return;
        prev.setMonth(prev.getMonth() - 1);
        setViewDate(prev);
    };

    // Effect to fetch slots when date changes
    useEffect(() => {
        if (selectedDate !== null) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true);
                setSelectedTime(null); // Reset time selection
                const slots = await getAvailableSlots(new Date(selectedDate).toISOString());
                setAvailableTimeSlots(slots);
                setIsLoadingSlots(false);
            };
            fetchSlots();
        }
    }, [selectedDate]);


    const handleConfirm = async () => {
        if (!selectedService || selectedDate === null || !selectedTime || !formData.name || !formData.phone) {
            alert("Por favor completa todos los campos requeridos");
            return;
        }

        setIsSubmitting(true);
        const result = await createBooking({
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            servicePrice: selectedService.price,
            serviceDuration: selectedService.duration,
            date: new Date(selectedDate),
            time: selectedTime,
            clientName: formData.name,
            clientPhone: formData.phone,
            notes: formData.notes
        });

        setIsSubmitting(false);

        if (result.success) {
            setStep(4); // Go to Success Step
        } else {
            alert("Hubo un error al reservar. Inténtalo de nuevo.");
        }
    };
    // ----------------------


    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={48} />
                    <p className="text-gray-500 font-medium italic">Cargando servicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">

            {/* MAIN CARD CONTAINER */}
            <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[650px] animate-in fade-in zoom-in duration-500">

                {/* LEFT SIDEBAR (Info Panel) */}
                <div className="md:w-1/3 bg-gray-50/50 border-r border-gray-100 p-8 flex flex-col justify-between relative">
                    {/* Back Button (only if not on step 1) */}
                    {step > 1 && step < 4 && (
                        <button
                            onClick={() => {
                                if (step === 3 && selectedTime) setStep(2);
                                else if (step === 2) setStep(1);
                                else setStep(step - 1);
                            }}
                            className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100 hover:bg-gray-100 text-gray-500 transition-all hover:scale-105 active:scale-95 z-10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    <div>
                        {/* Logo / Brand */}
                        <div className="mb-10 mt-6 md:mt-10">
                            {settingsData.logoUrl ? (
                                <img src={settingsData.logoUrl} alt={settingsData.name} className="h-12 w-auto mb-4" />
                            ) : (
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">C</div>
                                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
                                        {settingsData.name}
                                    </h2>
                                </div>
                            )}
                            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
                                {settingsData.headerText}
                            </h1>
                        </div>

                        {/* Selected Service Summary (if selected) */}
                        {selectedService && (
                            <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-300">
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest mb-2">Servicio seleccionado</p>
                                <p className="text-xl font-bold text-gray-900 mb-1">{selectedService.name}</p>
                                <p className="text-lg font-medium text-blue-600">{selectedService.price}</p>
                                
                                {selectedDate && (
                                    <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CalendarIcon size={14} className="text-blue-500" />
                                            <span className="capitalize">{new Date(selectedDate).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                        </div>
                                        {selectedTime && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Clock size={14} className="text-blue-500" />
                                                <span>{selectedTime}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Metadata List */}
                        <div className="space-y-4 px-2">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <Clock size={18} />
                                </div>
                                <span className="text-sm font-medium">{selectedService ? selectedService.duration : "Duración variable"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <MapPin size={18} />
                                </div>
                                <span className="text-sm font-medium">{settingsData.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                    <Globe size={18} />
                                </div>
                                <span className="text-sm font-medium">Asistencia personalizada</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-xs text-gray-400">
                        © 2026 {settingsData.name}. Powered by IA.
                    </div>
                </div>

                {/* RIGHT PANEL (Interaction Area) */}
                <div className="md:w-2/3 p-8 md:p-12 bg-white relative overflow-y-auto max-h-[90vh] custom-scrollbar">

                    {/* STEP 1: SERVICES */}
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Reserva tu cita</h2>
                                <p className="text-gray-500">Selecciona el tratamiento que deseas realizarte.</p>
                            </div>
                            <div className="grid gap-4">
                                {services.map((srv) => (
                                    <button
                                        key={srv.id}
                                        onClick={() => {
                                            setSelectedService(srv);
                                            setStep(2);
                                        }}
                                        className="w-full bg-white p-6 rounded-2xl border border-gray-100 text-left hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50/50 transition-all group flex justify-between items-center relative overflow-hidden"
                                    >
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-blue-600 transition-colors"></div>
                                        <div>
                                            <p className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">{srv.name}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                                                    <Clock size={12} /> {srv.duration}
                                                </span>
                                                <span className="text-sm font-bold text-gray-700">{srv.price}</span>
                                            </div>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <ChevronRight size={20} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CALENDAR & TIME (MONTH VIEW) */}
                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="flex flex-col lg:flex-row gap-8">
                                {/* Calendar Column */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-gray-900">Selecciona Fecha</h2>
                                        <div className="flex items-center bg-gray-50 rounded-lg p-1">
                                            <button onClick={prevMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500">
                                                <ChevronLeft size={16} />
                                            </button>
                                            <span className="px-4 text-sm font-bold text-gray-700 capitalize w-32 text-center">{monthName}</span>
                                            <button onClick={nextMonth} className="p-2 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-500">
                                                <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Month Grid */}
                                    <div className="bg-gray-50/50 rounded-2xl p-4">
                                        <div className="grid grid-cols-7 mb-4 text-center">
                                            {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(day => (
                                                <div key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest py-2">{day}</div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-1">
                                            {calendarDays.map((d, i) => {
                                                if (!d.day) return <div key={i} />;
                                                
                                                const isSelected = selectedDate && new Date(selectedDate).toDateString() === d.date?.toDateString();
                                                const disabled = d.isPast || d.isWeekend;

                                                return (
                                                    <button
                                                        key={i}
                                                        disabled={disabled}
                                                        onClick={() => handleDateSelect(d.date!)}
                                                        className={`
                                                            aspect-square w-full rounded-xl flex flex-col items-center justify-center text-sm transition-all relative group
                                                            ${disabled 
                                                                ? "text-gray-300 cursor-not-allowed" 
                                                                : isSelected
                                                                    ? "bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 scale-105 z-10"
                                                                    : "text-gray-700 hover:bg-white hover:text-blue-600 hover:shadow-sm"
                                                            }
                                                        `}
                                                    >
                                                        {d.isToday && !isSelected && (
                                                            <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                        )}
                                                        <span className="z-10">{d.day}</span>
                                                        {isSelected && <span className="text-[8px] absolute bottom-1 font-bold uppercase z-10">Sel.</span>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="mt-6 flex items-center gap-4 text-[10px] text-gray-400 font-medium ml-2">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Hoy
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 rounded-full border border-gray-300"></div> Disponible
                                        </div>
                                    </div>
                                </div>

                                {/* Time Slots Column */}
                                <div className={`lg:w-64 transition-all duration-500 ${selectedDate ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Selecciona Hora</h3>
                                    
                                    <div className="bg-white border-l border-gray-100 lg:pl-6 min-h-[300px]">
                                        {isLoadingSlots ? (
                                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                                <Loader2 className="animate-spin text-blue-600" size={24} />
                                                <p className="text-xs text-gray-400 font-medium">Buscando huecos...</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                                                {availableTimeSlots.map(time => (
                                                    <button
                                                        key={time}
                                                        onClick={() => {
                                                            setSelectedTime(time);
                                                            setStep(3);
                                                        }}
                                                        className="py-3 px-4 rounded-xl border border-gray-100 text-gray-700 hover:border-blue-600 hover:text-blue-600 font-bold text-sm transition-all hover:shadow-lg hover:shadow-blue-50 flex items-center justify-between group"
                                                    >
                                                        {time}
                                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </button>
                                                ))}
                                                {availableTimeSlots.length === 0 && selectedDate && (
                                                    <div className="py-12 text-center">
                                                        <p className="text-gray-400 text-sm italic">No hay disponibilidad para este día.</p>
                                                    </div>
                                                )}
                                                {!selectedDate && (
                                                    <div className="py-12 text-center">
                                                        <p className="text-gray-400 text-sm italic">Clica en un día para ver las horas.</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: FORM */}
                    {step === 3 && (
                        <div className="animate-fade-in max-w-lg mx-auto">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Completa tus datos</h2>

                            <div className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre y Apellidos</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ej. María García"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Teléfono Móvil</label>
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Ej. 600 123 456"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Notas adicionales (Opcional)</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all resize-none h-24"
                                        placeholder="Alergias, dudas..."
                                    />
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    disabled={isSubmitting}
                                    className={`w-full py-4 rounded-xl text-white font-bold shadow-lg shadow-blue-200 transition-all transform hover:scale-[1.01] active:scale-95 flex justify-center items-center gap-2 mt-4
                                        ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
                                    `}
                                >
                                    {isSubmitting ? "Confirmando..." : "Confirmar Reserva"}
                                    {!isSubmitting && <Check size={20} />}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: SUCCESS */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-50">
                                <Check size={48} strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Reserva Confirmada!</h2>
                            <p className="text-gray-500 max-w-md mx-auto mb-8 text-lg">
                                Gracias <strong>{formData.name.split(' ')[0]}</strong>. Hemos agendado tu cita para el <strong>{selectedDate ? new Date(selectedDate).toLocaleDateString() : ''} a las {selectedTime}</strong>.
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-black transition-all shadow-lg"
                                >
                                    Volver al inicio
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Simple Footer / Credit */}
            <div className="fixed bottom-4 right-4 text-[10px] text-gray-300 pointer-events-none">
                Powered by ClínicasApp
            </div>
        </div>
    );
}
