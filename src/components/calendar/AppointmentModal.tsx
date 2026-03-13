"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, User, Briefcase, Save, Loader2 } from "lucide-react";
import { saveAppointment } from "@/lib/actions";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
  categories: any[];
}

export function AppointmentModal({ isOpen, onClose, clients, categories }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  console.log("AppointmentModal rendered, isOpen:", isOpen);

  const [formData, setFormData] = useState({
    clientId: "",
    serviceName: "",
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    notes: "",
  });

  if (!isOpen) return null;

  // Flatten services from categories with safety check
  const allServices = (categories || []).flatMap(cat => 
    (cat.services || []).map((s: any) => ({ ...s, categoryName: cat.name }))
  );
  
  console.log("Available clients:", clients?.length);
  console.log("Available services:", allServices.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedService = allServices.find(s => s.name === formData.serviceName);
      const appointmentDate = new Date(`${formData.date}T${formData.time}`);

      const result = await saveAppointment({
        clientId: formData.clientId,
        serviceName: formData.serviceName,
        date: appointmentDate,
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 0,
        notes: formData.notes,
      });

      if (result.success) {
        onClose();
        // Trigger a refresh or local update if needed
        window.location.reload(); 
      } else {
        alert(result.error || "Error al guardar la cita");
      }
    } catch (error) {
      console.error("Error submitting appointment:", error);
      alert("Error al procesar la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <CalendarIcon size={20} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Nueva Cita Manual</h3>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Client Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                Cliente
              </label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>

            {/* Service Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Briefcase size={14} className="text-gray-400" />
                Servicio
              </label>
              <select
                required
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all bg-white"
              >
                <option value="">Seleccionar servicio...</option>
                {allServices.map((service, idx) => (
                  <option key={idx} value={service.name}>
                    {service.name} ({service.price}€)
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <CalendarIcon size={14} className="text-gray-400" />
                Fecha
              </label>
              <input
                required
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>

            {/* Time */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                Hora
              </label>
              <input
                required
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Notas adicionales</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[80px]"
              placeholder="Ej. El cliente prefiere..."
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-50 text-gray-700 rounded-xl font-medium hover:bg-gray-100 transition-all border border-gray-200"
            >
              Cancelar
            </button>
            <button
              disabled={loading}
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Confirmar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
