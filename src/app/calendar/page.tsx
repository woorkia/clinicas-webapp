import { Plus } from "lucide-react";
import { CalendarView } from "@/components/calendar/CalendarView";

export default function CalendarPage() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Calendario de Citas</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona tu agenda y visualiza la disponibilidad.
                    </p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                    <Plus size={18} />
                    Nueva Cita
                </button>
            </div>

            {/* Main Calendar Area */}
            <div className="flex-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
                <CalendarView />
            </div>
        </div>
    );
}
