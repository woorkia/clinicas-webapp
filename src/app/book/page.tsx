"use client";

import { useState, useEffect } from "react";
import { Clock, MapPin, Globe, ChevronLeft, ChevronRight, Check, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { createBooking, getAvailableSlots } from "./actions";
import { getCategories } from "@/app/admin/automation/actions";

export default function BookingPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadServices = async () => {
            setIsLoading(true);
            const categories = await getCategories();
            // Flatten categories to get a simple services list for now
            // or we could show them by category. Let's flatten to keep UI simple for now.
            const allServices = categories.flatMap((cat: any) =>
                cat.services.map((s: any) => ({
                    ...s,
                    categoryName: cat.name,
                    price: s.price > 0 ? `${s.price}€` : "Gratis",
                    duration: `${s.duration} min`
                }))
            );
            setServices(allServices);
            setIsLoading(false);
        };
        loadServices();
    }, []);

    // Generate dates for the next 28 days to fill the grid
    const dates = Array.from({ length: 35 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.getDate(),
            weekday: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][d.getDay()],
            month: d.toLocaleString('es-ES', { month: 'long' }),
            year: d.getFullYear(),
            isWeekend: d.getDay() === 0 || d.getDay() === 6,
            fullDate: d,
            offset: i
        };
    });

    // Effect to fetch slots when date changes
    useEffect(() => {
        if (selectedDate !== null) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true);
                setSelectedTime(null); // Reset time selection

                const d = new Date();
                d.setDate(d.getDate() + selectedDate);
                const slots = await getAvailableSlots(d.toISOString());
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

        const appointmentDate = new Date();
        appointmentDate.setDate(appointmentDate.getDate() + selectedDate);

        const result = await createBooking({
            serviceId: selectedService.id,
            serviceName: selectedService.name,
            servicePrice: selectedService.price,
            serviceDuration: selectedService.duration,
            date: appointmentDate,
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

    // --- RENDER HELPERS ---
    const currentMonth = new Date().toLocaleString('es-ES', { month: 'long', year: 'numeric' });

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
            <div className="w-full max-w-6xl bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

                {/* LEFT SIDEBAR (Info Panel) */}
                <div className="md:w-[35%] bg-white border-r border-gray-100 p-8 flex flex-col justify-between relative">
                    {/* Back Button (only if not on step 1) */}
                    {step > 1 && step < 4 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="absolute top-6 left-6 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}

                    <div>
                        {/* Logo / Brand */}
                        <div className="mb-8 mt-2">
                            {/* Keep logo concise or use text */}
                            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">Clínica Demo</h2>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                Saca tu mejor sonrisa <br /> con nosotros 😎
                            </h1>
                        </div>

                        {/* Selected Service Summary (if selected) */}
                        {selectedService && step < 4 && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-100 animate-fade-in-up">
                                <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">Servicio seleccionado</p>
                                <p className="text-lg font-bold text-blue-900">{selectedService.name}</p>
                                <p className="text-blue-700">{selectedService.price}</p>
                            </div>
                        )}

                        {/* Metadata List */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Clock size={20} className="text-gray-400" />
                                <span className="text-sm font-medium">{selectedService ? selectedService.duration : "Duración variable"}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin size={20} className="text-gray-400" />
                                <span className="text-sm font-medium">Valencia, Calle Flores n3</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Globe size={20} className="text-gray-400" />
                                <span className="text-sm font-medium">Conferencia web disponible</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 text-xs text-gray-400">
                        © 2026 Clínica Demo. Todos los derechos reservados.
                    </div>
                </div>

                {/* RIGHT PANEL (Interaction Area) */}
                <div className="md:w-[65%] p-8 md:p-12 bg-white relative overflow-y-auto max-h-[90vh]">

                    {/* STEP 1: SERVICES */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Selecciona un servicio</h2>
                            <div className="grid gap-4">
                                {services.map((srv) => (
                                    <button
                                        key={srv.id}
                                        onClick={() => {
                                            setSelectedService(srv);
                                            setStep(2);
                                        }}
                                        className="w-full bg-white p-6 rounded-2xl border border-gray-200 text-left hover:border-blue-400 hover:shadow-lg hover:shadow-blue-50 transition-all group flex justify-between items-center"
                                    >
                                        <div>
                                            <p className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{srv.name}</p>
                                            <p className="text-gray-500 mt-1 flex items-center gap-2">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">{srv.duration}</span>
                                                <span className="text-sm">• {srv.price}</span>
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <ChevronRight size={18} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 2: CALENDAR & TIME */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Selecciona una fecha y hora</h2>
                            <p className="text-gray-500 mb-8 capitalize">{currentMonth}</p>

                            {/* Calendar Grid */}
                            <div className="mb-8">
                                <div className="grid grid-cols-7 mb-4 text-center">
                                    {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(day => (
                                        <div key={day} className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{day}</div>
                                    ))}
                                </div>
                                <div className="grid grid-cols-7 gap-y-2 gap-x-2">
                                    {/* Simple offset for demo purposes (assuming starts on correct day or just listing next days) */}
                                    {/* Ideally we calculate the offset of the 1st of the month, but for 'Next Days' flow we just list them */}
                                    {dates.slice(0, 28).map((d, i) => {
                                        const isSelected = selectedDate === d.offset;
                                        return (
                                            <button
                                                key={i}
                                                onClick={() => setSelectedDate(d.offset)}
                                                className={`
                                                    h-12 w-full rounded-full flex items-center justify-center text-sm font-medium transition-all
                                                    ${isSelected
                                                        ? "bg-blue-100 text-blue-700 font-bold ring-2 ring-blue-600"
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                                                    }
                                                    ${d.isWeekend ? "text-gray-300 pointer-events-none" : ""} 
                                                `}
                                                disabled={d.isWeekend}
                                            >
                                                {d.day}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Time Slots (Conditionally displayed below or to the side could work too, adhering to layout below for now) */}
                            <div className={`transition-all duration-500 ease-in-out ${selectedDate !== null ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 p-2 border-t border-gray-100 pt-6">Horas disponibles para el {dates[selectedDate || 0]?.day}</h3>

                                {isLoadingSlots ? (
                                    <div className="flex justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                        {availableTimeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => {
                                                    setSelectedTime(time);
                                                    setStep(3);
                                                }}
                                                className="py-2 px-4 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-600 hover:text-white font-medium text-sm transition-all focus:ring-2 focus:ring-blue-300 focus:ring-offset-1"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {availableTimeSlots.length === 0 && !isLoadingSlots && (
                                    <p className="text-gray-400 text-sm text-center italic">No hay huecos libres.</p>
                                )}
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
                                Gracias <strong>{formData.name.split(' ')[0]}</strong>. Hemos agendado tu cita para el <strong>{new Date(new Date().setDate(new Date().getDate() + (selectedDate || 0))).toLocaleDateString()} a las {selectedTime}</strong>.
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
