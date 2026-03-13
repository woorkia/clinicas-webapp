import { Download, Plus, Search, Filter } from "lucide-react";
export const dynamic = 'force-dynamic';
import { ClientsTable } from "@/components/clients/ClientsTable";
import { prisma } from "@/lib/prisma";
import { ClientManager } from "@/components/clients/ClientManager";

export default async function ClientsPage() {
    let clients: any[] = [];
    try {
        clients = await prisma.client.findMany({
            include: {
                appointments: {
                    orderBy: { date: 'desc' },
                    take: 1
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching clients:", error);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Base de Datos de Clientes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestión centralizada de todos los pacientes y su historial.
                    </p>
                </div>
                <ClientManager clients={clients} />
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                        <Filter size={18} />
                        Filtros
                    </button>
                </div>
            </div>

            {/* Main Table Area */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <ClientsTable data={clients} />
            </div>
        </div>
    );
}
