import Link from 'next/link';
import { Calendar, Shield, ArrowRight, HeartPulse, Building2 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Soft decorative background circles */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-100/40 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }}></div>

            <main className="w-full max-w-4xl relative z-10 flex flex-col items-center">
                {/* Header Section */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 border border-blue-100 shadow-sm">
                        <HeartPulse size={14} className="animate-pulse" />
                        Software de Salud de Próxima Generación
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                        Clínicas <span className="text-blue-600 relative">
                            Llenas
                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" className="text-blue-200" />
                            </svg>
                        </span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-xl mx-auto font-medium">
                        La plataforma inteligente para conectar pacientes con clínicas, optimizando cada cita.
                    </p>
                </div>

                {/* Main CTA Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                    {/* Patient Portal Card */}
                    <Link href="/book" className="group">
                        <div className="h-full bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-blue-200/40 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col items-start text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-blue-600 transition-colors duration-500 flex items-center justify-center pt-8 pl-8">
                                <Calendar size={32} className="text-blue-600 group-hover:text-white transition-colors duration-500" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-slate-900 mb-4 mt-8">Portal de Pacientes</h2>
                            <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                                Reserva tu cita de forma rápida y sencilla. Elige el servicio y el horario que mejor te convenga.
                            </p>
                            
                            <div className="mt-auto flex items-center gap-3 text-blue-600 font-extrabold text-lg group-hover:gap-5 transition-all">
                                Reservar Cita Online <ArrowRight size={22} />
                            </div>
                        </div>
                    </Link>

                    {/* Admin Panel Card */}
                    <Link href="/login" className="group">
                        <div className="h-full bg-slate-900 rounded-[40px] p-10 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden flex flex-col items-start text-left">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-bl-[80px] -mr-8 -mt-8 group-hover:bg-indigo-600 transition-colors duration-500 flex items-center justify-center pt-8 pl-8">
                                <Shield size={32} className="text-slate-400 group-hover:text-white transition-colors duration-500" />
                            </div>
                            
                            <h2 className="text-3xl font-black text-white mb-4 mt-8">Panel de Control</h2>
                            <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                                Accede a la gestión administrativa, calendarios, automatización y estadísticas de tu clínica.
                            </p>
                            
                            <div className="mt-auto flex items-center gap-3 text-white font-extrabold text-lg group-hover:gap-5 transition-all">
                                Acceso Personal <ArrowRight size={22} className="text-indigo-400" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Footer / Trust Badge */}
                <div className="mt-20 flex flex-wrap justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 font-bold text-slate-900">
                        <Building2 size={20} />
                        CLINIC-NETWORK
                    </div>
                </div>
            </main>
        </div>
    );
}
