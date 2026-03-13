"use client";

import { useState, useEffect } from "react";
import { Lock, User, Save, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { getClinicSettings, updateClinicSettings } from "@/lib/actions";

export function AdminSecurity() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadSettings() {
            const settings = await getClinicSettings() as any;
            if (settings) {
                setUsername(settings.adminUsername || "admin");
                setPassword(settings.adminPassword || "admin123");
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        
        if (username.length < 3) {
            setError("El usuario debe tener al menos 3 caracteres");
            return;
        }
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return;
        }

        setSaving(true);
        try {
            const result = await updateClinicSettings({
                adminUsername: username,
                adminPassword: password
            });
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setError("Error al actualizar las credenciales");
            }
        } catch (error) {
            console.error("Error saving security settings:", error);
            setError("Error de conexión");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-primary" size={24} />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Seguridad del Panel</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona tus credenciales de acceso administrativo.
                    </p>
                </div>
            </div>

            <div className="max-w-2xl bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-4 mb-8">
                    <div className="p-2 bg-amber-100 text-amber-600 rounded-lg h-fit">
                        <ShieldAlert size={20} />
                    </div>
                    <div className="text-sm">
                        <p className="font-bold text-amber-900 mb-0.5">Cuidado con los cambios</p>
                        <p className="text-amber-800 opacity-80 leading-relaxed">
                            Asegúrate de recordar las nuevas credenciales. Si las pierdes, tendrás que contactar con soporte técnico para resetearlas.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Usuario Administrador</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <User size={18} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                placeholder="Usuario"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Nueva Contraseña</label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="text"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                placeholder="Contraseña"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition-all shadow-lg ${
                            showSuccess 
                            ? "bg-green-500 text-white shadow-green-200" 
                            : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                        }`}
                    >
                        {saving ? (
                            <Loader2 className="animate-spin" size={20} />
                        ) : showSuccess ? (
                            <CheckCircle2 size={20} />
                        ) : (
                            <Save size={20} />
                        )}
                        {showSuccess ? "Credenciales Actualizadas" : "Guardar Cambios de Seguridad"}
                    </button>
                </form>
            </div>
        </div>
    );
}
