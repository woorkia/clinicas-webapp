"use client";

import { useState } from "react";
import { Download, Plus } from "lucide-react";
import { ClientModal } from "./ClientModal";
import { saveClient } from "@/lib/actions";

interface ClientManagerProps {
  clients: any[];
}

export function ClientManager({ clients }: ClientManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const handleCreate = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleSave = async (data: any) => {
    const result = await saveClient(data);
    if (!result.success) {
      alert(result.error || "Error al guardar el cliente");
    }
  };

  const handleExportCSV = () => {
    if (clients.length === 0) return;

    const headers = ["ID", "Nombre", "Email", "Teléfono", "Fecha de Registro"];
    const csvRows = [
      headers.join(","),
      ...clients.map(c => [
        c.id,
        `"${c.name}"`,
        c.email || "",
        c.phone,
        new Date(c.createdAt).toLocaleDateString()
      ].join(","))
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `clientes_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex gap-3">
        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <Download size={18} />
          <span className="hidden sm:inline">Exportar CSV</span>
        </button>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        client={selectedClient}
      />
    </>
  );
}
