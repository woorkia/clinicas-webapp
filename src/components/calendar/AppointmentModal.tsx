"use client";

import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, User, Briefcase, Save, Loader2 } from "lucide-react";
import { saveAppointment, saveClient } from "@/lib/actions";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
  categories: any[];
}

export function AppointmentModal({ isOpen, onClose, clients, categories }: AppointmentModalProps) {
  const [loading, setLoading] = useState(false);
  const [isNewClient, setIsNewClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showClientList, setShowClientList] = useState(false);

  const [formData, setFormData] = useState({
    clientId: "",
    serviceName: "",
    date: new Date().toISOString().split('T')[0],
    time: "10:00",
    notes: "",
    // New client fields
    newClientName: "",
    newClientPhone: "",
    newClientEmail: "",
  });

  if (!isOpen) return null;

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const allServices = (categories || []).flatMap(cat => 
    (cat.services || []).map((s: any) => ({ ...s, categoryName: cat.name }))
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalClientId = formData.clientId;

      // Handle new client creation if needed
      if (isNewClient) {
        if (!formData.newClientName || !formData.newClientPhone) {
          alert("Por favor rellena el nombre y teléfono del nuevo cliente");
          setLoading(false);
          return;
        }

        const clientResult = await saveClient({
          name: formData.newClientName,
          phone: formData.newClientPhone,
          email: formData.newClientEmail,
        });

        if (clientResult.success && clientResult.client) {
          finalClientId = clientResult.client.id;
        } else {
          alert(clientResult.error || "Error al crear el cliente");
          setLoading(false);
          return;
        }
      } else if (!finalClientId) {
        alert("Por favor selecciona un cliente");
        setLoading(false);
        return;
      }

      const selectedService = allServices.find(s => s.name === formData.serviceName);
      const appointmentDate = new Date(`${formData.date}T${formData.time}`);

      const result = await saveAppointment({
        clientId: finalClientId,
        serviceName: formData.serviceName,
        date: appointmentDate,
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 0,
        notes: formData.notes,
      });

      if (result.success) {
        onClose();
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-4">
            {/* Client Selection */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User size={14} className="text-gray-400" />
                  Cliente
                </label>
                <button 
                  type="button"
                  onClick={() => setIsNewClient(!isNewClient)}
                  className={`text-xs font-bold transition-colors ${isNewClient ? 'text-blue-600' : 'text-gray-400 hover:text-blue-600'}`}
                >
                  {isNewClient ? "← Elegir existente" : "+ Nuevo cliente"}
                </button>
              </div>

              {!isNewClient ? (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre o tel..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowClientList(true);
                      // Clear selection if searching
                      if (formData.clientId) setFormData({ ...formData, clientId: "" });
                    }}
                    onFocus={() => setShowClientList(true)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                  
                  {showClientList && (searchTerm || filteredClients.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        filteredClients.map(client => (
                          <button
                            key={client.id}
                            type="button"
                            onClick={() => {
                              setFormData({ ...formData, clientId: client.id });
                              setSearchTerm(client.name);
                              setShowClientList(false);
                            }}
                            className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center justify-between group transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900">{client.name}</span>
                              <span className="text-[10px] text-gray-500">{client.phone}</span>
                            </div>
                            {formData.clientId === client.id && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 italic">No se encontraron clientes</div>
                      )}
                    </div>
                  )}
                  {formData.clientId && (
                     <div className="mt-2 text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded inline-block">
                        Cliente seleccionado: {clients.find(c => c.id === formData.clientId)?.name}
                     </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3 p-4 bg-gray-50 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Nombre completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Juan Pérez"
                      value={formData.newClientName}
                      onChange={(e) => setFormData({ ...formData, newClientName: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Teléfono *</label>
                      <input
                        type="tel"
                        required
                        placeholder="600000000"
                        value={formData.newClientPhone}
                        onChange={(e) => setFormData({ ...formData, newClientPhone: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Email (opcional)</label>
                      <input
                        type="email"
                        placeholder="juan@email.com"
                        value={formData.newClientEmail}
                        onChange={(e) => setFormData({ ...formData, newClientEmail: e.target.value })}
                        className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
