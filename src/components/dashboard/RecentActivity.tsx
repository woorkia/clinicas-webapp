import { Calendar, CheckCircle2, Clock } from "lucide-react";

const activities = [
    {
        id: 1,
        client: "Ana García",
        action: "Cita programada automáticamente",
        time: "Hace 10 min",
        type: "appointment",
    },
    {
        id: 2,
        client: "Carlos López",
        action: "Mensaje de WhatsApp recibido",
        time: "Hace 25 min",
        type: "message",
    },
    {
        id: 3,
        client: "María Rodriguez",
        action: "Recordatorio enviado",
        time: "Hace 1 hora",
        type: "reminder",
    },
    {
        id: 4,
        client: "Pedro Martínez",
        action: "Cita completada",
        time: "Hace 2 horas",
        type: "completed",
    },
];

export function RecentActivity() {
    return (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/50">
                <h3 className="font-semibold text-gray-900">Actividad Reciente</h3>
            </div>
            <div className="divide-y divide-border/50">
                {activities.map((activity) => (
                    <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                        <div className="rounded-full bg-blue-50 p-2 text-blue-600">
                            {activity.type === "appointment" && <Calendar size={18} />}
                            {activity.type === "message" && <Clock size={18} />}
                            {activity.type === "completed" && <CheckCircle2 size={18} />}
                            {activity.type === "reminder" && <Clock size={18} className="text-orange-500" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.client}</p>
                            <p className="text-xs text-gray-500">{activity.action}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
