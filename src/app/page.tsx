import {
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Clock,
  MoreHorizontal
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

export default function Home() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenido de nuevo, aquí está lo que sucede hoy en tu clínica.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
            Descargar Reporte
          </button>
          <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
            Nueva Cita Manual
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Citas Hoy"
          value="12"
          icon={Calendar}
          trend="8%"
          trendUp={true}
          color="blue"
        />
        <StatsCard
          title="Chats Activos"
          value="5"
          icon={MessageSquare}
          trend="2"
          trendUp={true}
          color="green"
        />
        <StatsCard
          title="Nuevos Clientes"
          value="24"
          icon={Users}
          trend="12%"
          trendUp={true}
          color="purple"
        />
        <StatsCard
          title="Tasa Conversión"
          value="68%"
          icon={TrendingUp}
          trend="3%"
          trendUp={false}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Próximas Citas</h3>
              <button className="text-sm text-primary hover:underline font-medium">Ver todas</button>
            </div>
            <div className="divide-y divide-border/50">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-medium">
                      JP
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Juan Pérez</p>
                      <p className="text-xs text-gray-500">Consulta General • Dr. Smith</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      <Clock size={14} />
                      <span>10:30 AM</span>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Banner */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Tu Agente IA está trabajando</h3>
              <p className="text-indigo-100 text-sm mb-4 max-w-lg">
                El bot ha gestionado 45 conversaciones hoy y ha agendado 8 citas automáticamente sin intervención humana.
              </p>
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm font-medium transition-colors backdrop-blur-sm">
                Ver Conversaciones en Vivo
              </button>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
            <div className="absolute bottom-0 right-20 w-32 h-32 bg-purple-400/20 rounded-full translate-y-1/3 blur-2xl"></div>
          </div>
        </div>

        {/* Right Column: Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
