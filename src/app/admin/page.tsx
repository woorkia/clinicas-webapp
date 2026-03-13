import Link from "next/link";
import { 
  Users, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  MoreHorizontal,
  Download,
  Plus
} from "lucide-react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { getDashboardStats } from "@/lib/actions";

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  let stats = {
    totalAppointments: 0,
    totalClients: 0,
    recentAppointments: [] as any[]
  };

  try {
    stats = await getDashboardStats();
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
  }

  const { totalAppointments, totalClients, recentAppointments } = stats;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Panel de Control</h1>
          <p className="text-gray-500 mt-1.5 font-medium">
            Bienvenido de nuevo, aquí está lo que sucede hoy en tu clínica.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
            <Download size={18} />
            Descargar Reporte
          </button>
          <Link 
            href="/book" 
            className="flex items-center gap-2 px-5 py-2.5 bg-[#00A3FF] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-all shadow-lg shadow-blue-100"
          >
            <Plus size={18} />
            Nueva Cita Manual
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Citas Totales"
          value={totalAppointments.toString()}
          icon={Calendar}
          trend="+1"
          trendUp={true}
          color="blue"
        />
        <StatsCard
          title="Chats Activos"
          value="0"
          icon={MessageSquare}
          trend="-"
          trendUp={true}
          color="green"
        />
        <StatsCard
          title="Total Clientes"
          value={totalClients.toString()}
          icon={Users}
          trend="+1"
          trendUp={true}
          color="purple"
        />
        <StatsCard
          title="Tasa Conversión"
          value="0%"
          icon={TrendingUp}
          trend="0%"
          trendUp={false}
          color="orange"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upcoming Appointments & IA Banner */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Appointments Card */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden text-sm">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Próximas Citas</h3>
              <button className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors">Ver todas</button>
            </div>
            <div className="divide-y divide-gray-50">
              {recentAppointments.length === 0 ? (
                <div className="p-12 text-center text-gray-400 font-medium italic">No hay citas próximas programadas.</div>
              ) : (
                recentAppointments.map((app) => (
                  <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm border border-gray-100">
                        {app.client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{app.client.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium uppercase tracking-wider">{app.serviceName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2.5 text-gray-500 font-semibold bg-gray-50/50 px-4 py-1.5 rounded-full border border-gray-100">
                        <Clock size={16} className="text-gray-400" />
                        <span>{new Date(app.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <button className="p-2 text-gray-300 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal size={20} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AI Working Banner - Purple Premium */}
          <div className="bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#A855F7] rounded-[24px] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md border border-white/20">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Agente Activo
              </div>
              <h3 className="text-2xl font-black mb-3 tracking-tight">Tu Agente IA está trabajando</h3>
              <p className="text-purple-50 text-base font-medium mb-6 max-w-lg opacity-90 leading-relaxed">
                El bot ha gestionado 45 conversaciones hoy y ha agendado 8 citas automáticamente sin intervención humana.
              </p>
              <button className="px-6 py-2.5 bg-white text-[#8B5CF6] hover:bg-purple-50 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-white/10 active:scale-95">
                Ver Conversaciones en Vivo
              </button>
            </div>
            {/* Visual Glassmorphism Shapes */}
            <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-white/10 rounded-full blur-[80px] group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute bottom-[-30%] left-[20%] w-60 h-60 bg-indigo-400/20 rounded-full blur-[60px]"></div>
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
