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
    <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full text-sm">
      <div className="p-6 border-b border-gray-50">
        <h3 className="text-lg font-bold text-gray-900">Actividad Reciente</h3>
      </div>
      <div className="flex-1 divide-y divide-gray-50 overflow-y-auto">
        {activities.map((activity) => (
          <div key={activity.id} className="p-5 flex items-center gap-4 hover:bg-gray-50 transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
              activity.type === "appointment" ? "bg-blue-50 text-blue-600 border-blue-100" :
              activity.type === "message" ? "bg-green-50 text-green-600 border-green-100" :
              "bg-purple-50 text-purple-600 border-purple-100"
            }`}>
              {activity.type === "appointment" && <Calendar size={18} />}
              {activity.type === "message" && <Clock size={18} />}
              {activity.type === "completed" && <CheckCircle2 size={18} />}
              {activity.type === "reminder" && <Clock size={18} />}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 leading-tight">{activity.client}</p>
              <p className="text-[11px] text-gray-400 font-medium mt-0.5">{activity.action}</p>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{activity.time}</span>
          </div>
        ))}
      </div>
      <div className="p-4 bg-gray-50/50 border-t border-gray-50 text-center">
        <button className="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
          Ver Historial Completo
        </button>
      </div>
    </div>
  );
}
