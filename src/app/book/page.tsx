"use client";

import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

import { createBooking, getAvailableSlots } from "./actions";

export default function BookingPage() {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<any | null>(null);
    const [selectedDate, setSelectedDate] = useState<number | null>(null);

    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
    const [isLoadingSlots, setIsLoadingSlots] = useState(false);

    // Effect to fetch slots when date changes


    useEffect(() => {
        if (selectedDate !== null) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true);
                setSelectedTime(null); // Reset time selection

                const d = new Date();
                d.setDate(d.getDate() + selectedDate);
                // Send ISO string but ensure we handle timezone correctly on server or just send date part? 
                // For simplicity let's send full ISO string
                const slots = await getAvailableSlots(d.toISOString());
                setAvailableTimeSlots(slots);
                setIsLoadingSlots(false);
            };
            fetchSlots();
        }
    }, [selectedDate]);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        notes: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mock services
    const services = [
        { id: 1, name: "Consultoría Inicial", duration: "30 min", price: "Gratis" },
        { id: 2, name: "Higiene Facial Profunda", duration: "60 min", price: "45€" },
        { id: 3, name: "Masaje Descontracturante", duration: "45 min", price: "50€" },
    ];

    // Mock availability
    const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i);
        return {
            day: d.getDate(),
            weekday: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"][d.getDay()],
            fullDate: d,
        };
    });



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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
            {/* Header / Brand */}
            {step < 4 && (
                <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 mb-4 mt-4 border border-gray-100">
                    <h1 className="text-xl font-bold text-gray-900 text-center">Clínica Demo</h1>
                    <p className="text-gray-500 text-center text-sm">Reserva tu cita</p>
                    {step > 1 && (
                        <button
                            onClick={() => setStep(step - 1)}
                            className="absolute top-8 left-8 text-gray-400 hover:text-gray-600"
                        >
                            ←
                        </button>
                    )}
                </div>
            )}

            {/* STEP 1: SERVICE SELECTION */}
            {step === 1 && (
                <div className="w-full max-w-md">
                    <h3 className="text-gray-900 font-semibold mb-4 ml-1">Selecciona un servicio</h3>
                    <div className="space-y-3">
                        {services.map((srv) => (
                            <button
                                key={srv.id}
                                onClick={() => {
                                    setSelectedService(srv);
                                    setStep(2);
                                }}
                                className="w-full bg-white p-4 rounded-xl border border-gray-200 text-left hover:border-blue-300 hover:shadow-md transition-all flex justify-between items-center group"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900 group-hover:text-blue-700">{srv.name}</p>
                                    <p className="text-gray-500 text-sm">{srv.duration} • {srv.price}</p>
                                </div>
                                <div className="text-gray-300 group-hover:text-blue-500">→</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* STEP 2: DATE & TIME */}
            {step === 2 && selectedService && (
                <>
                    {/* Service Summary (Small) */}
                    <div className="w-full max-w-md bg-blue-50 rounded-xl p-4 mb-6 border border-blue-100 flex items-center justify-between">
                        <div>
                            <p className="text-blue-900 font-medium">{selectedService.name}</p>
                            <p className="text-blue-600 text-sm">{selectedService.duration} • {selectedService.price}</p>
                        </div>
                        <button onClick={() => setStep(1)} className="text-blue-400 text-sm hover:underline">Cambiar</button>
                    </div>

                    {/* Date Selection - Full Month Grid */}
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
                        <h3 className="text-gray-900 font-semibold mb-4">1. Elige un día</h3>

                        {/* Weekday Headers */}
                        <div className="grid grid-cols-7 mb-2 text-center text-xs font-medium text-gray-400">
                            <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sá</div>
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Empty slots for offset (mocking starting on current day) */}
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={`empty-${i}`} />
                            ))}

                            {Array.from({ length: 30 }).map((_, i) => {
                                const d = new Date();
                                d.setDate(d.getDate() + i);
                                const isSelected = selectedDate === i;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedDate(i)}
                                        className={`aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all ${isSelected
                                            ? "bg-blue-600 text-white shadow-md scale-110"
                                            : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {d.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className={`w-full max-w-md bg-white rounded-2xl shadow-sm p-6 mb-20 border border-gray-100 transition-all duration-300 ${selectedDate !== null ? "opacity-100 translate-y-0" : "opacity-50 translate-y-4 pointer-events-none"
                        }`}>
                        <h3 className="text-gray-900 font-semibold mb-4">2. Elige una hora</h3>
                        {isLoadingSlots ? (
                            <div className="py-8 text-center text-gray-500 flex flex-col items-center">
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                                <p className="text-sm">Buscando huecos...</p>
                            </div>
                        ) : availableTimeSlots.length === 0 ? (
                            <p className="text-gray-500 text-center py-4 text-sm">No hay huecos disponibles para este día.</p>
                        ) : (
                            <div className="grid grid-cols-3 gap-3">
                                {availableTimeSlots.map((time) => (
                                    <button
                                        key={time}
                                        onClick={() => setSelectedTime(time)}
                                        className={`py-3 rounded-lg text-sm font-medium border transition-all ${selectedTime === time
                                            ? "bg-blue-600 border-blue-600 text-white shadow-md"
                                            : "bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                            }`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* STEP 3: PATIENT DETAILS */}
            {step === 3 && (
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-sm p-6 mb-4 border border-gray-100">
                        <h3 className="text-gray-900 font-semibold mb-4">3. Tus Datos</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Juan Pérez"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono (WhatsApp)</label>
                                <input
                                    type="tel"
                                    placeholder="Ej: 600 123 456"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones (Opcional)</label>
                                <textarea
                                    placeholder="¿Alguna alergia o petición?"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none h-24"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm space-y-2 mb-24 cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setStep(2)}>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Servicio:</span>
                            <span className="font-medium text-gray-900">{selectedService?.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Fecha:</span>
                            <span className="font-medium text-gray-900">
                                {selectedDate !== null && new Date(new Date().setDate(new Date().getDate() + selectedDate)).toLocaleDateString()} a las {selectedTime}
                            </span>
                        </div>
                        <div className="pt-2 text-center text-blue-500 hover:underline text-xs">
                            (Clic para corregir fecha)
                        </div>
                    </div>
                </div>
            )}

            {/* STEP 4: SUCCESS */}
            {step === 4 && (
                <div className="w-full max-w-md h-[80vh] flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                        <span className="text-4xl">✨</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Cita Confirmada!</h2>
                    <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                        Gracias <strong>{formData.name.split(' ')[0]}</strong>, te esperamos el día de la cita.
                        Te hemos enviado un mensaje de confirmación.
                    </p>
                    <button
                        onClick={() => {
                            setStep(1);
                            setFormData({ name: "", phone: "", notes: "" });
                            setSelectedService(null);
                            setSelectedDate(null);
                            setSelectedTime(null);
                        }}
                        className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-xl hover:bg-black transition-all"
                    >
                        Hacer otra reserva
                    </button>
                </div>
            )}

            {/* Sticky Buttons */}
            {step < 4 && (
                <div className="fixed bottom-6 left-0 right-0 px-4 flex justify-center pointer-events-none">
                    <div className="w-full max-w-md pointer-events-auto">
                        {/* Botón Siguiente (En paso 2) */}
                        {step === 2 && selectedTime && (
                            <button
                                onClick={() => setStep(3)}
                                className="w-full bg-gray-900 text-white font-semibold py-4 rounded-xl shadow-xl hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95"
                            >
                                Continuar
                            </button>
                        )}

                        {/* Botón Confirmar (En paso 3) */}
                        {step === 3 && (
                            <button
                                onClick={handleConfirm}
                                disabled={isSubmitting}
                                className={`w-full text-white font-semibold py-4 rounded-xl shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span>Guardando...</span>
                                ) : (
                                    <>
                                        <span>Confirmar Reserva</span>
                                        <span>✨</span>
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
