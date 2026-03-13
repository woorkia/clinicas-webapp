"use client";

import { useState, useEffect } from "react";
import { AdminSecurity } from "@/components/automation/AdminSecurity";
import { Settings, Building2, ShieldCheck, Loader2, Save, CheckCircle2 } from "lucide-react";
import { getClinicSettings, updateClinicSettings } from "@/lib/actions";
import { clsx } from "clsx";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<"general" | "security">("general");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [clinicInfo, setClinicInfo] = useState({
        name: "",
        address: "",
        phone: "",
        assistantName: ""
    });

    useEffect(() => {
        async function loadData() {
            const settings = await getClinicSettings() as any;
            if (settings) {
                setClinicInfo({
                    name: settings.name || "",
                    address: settings.address || "",
                    phone: settings.phone || "",
                    assistantName: settings.assistantName || ""
                });
            }
            setLoading(false);
        }
        loadData();
    }, []);

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            const result = await updateClinicSettings(clinicInfo);
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            }
        } catch (error) {
            console.error("Error saving general settings:", error);
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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Configuración de la Clínica</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Gestiona la información pública y la seguridad de tu panel.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab("general")}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === "general"
                            ? "bg-white text-primary shadow-sm ring-1 ring-border"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    )}
                >
                    <Building2 size={16} />
                    Información General
                </button>
                <button
                    onClick={() => setActiveTab("security")}
                    className={clsx(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                        activeTab === "security"
                            ? "bg-white text-primary shadow-sm ring-1 ring-border"
                            : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    )}
                >
                    <ShieldCheck size={16} />
                    Login y Contraseña
                </button>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === "general" && (
                    <div className="p-8 max-w-2xl space-y-6">
                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Nombre de la Clínica</label>
                                <input
                                    type="text"
                                    value={clinicInfo.name}
                                    onChange={(e) => setClinicInfo({ ...clinicInfo, name: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Dirección Física</label>
                                <input
                                    type="text"
                                    value={clinicInfo.address}
                                    onChange={(e) => setClinicInfo({ ...clinicInfo, address: e.target.value })}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Teléfono Público</label>
                                    <input
                                        type="text"
                                        value={clinicInfo.phone}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, phone: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Nombre del Asistente (IA)</label>
                                    <input
                                        type="text"
                                        value={clinicInfo.assistantName}
                                        onChange={(e) => setClinicInfo({ ...clinicInfo, assistantName: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2.5 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSaveGeneral}
                            disabled={saving}
                            className={clsx(
                                "flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg mt-8",
                                showSuccess 
                                ? "bg-green-500 text-white shadow-green-200" 
                                : "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                            )}
                        >
                            {saving ? (
                                <Loader2 className="animate-spin" size={18} />
                            ) : showSuccess ? (
                                <CheckCircle2 size={18} />
                            ) : (
                                <Save size={18} />
                            )}
                            {showSuccess ? "Guardado" : "Guardar Cambios"}
                        </button>
                    </div>
                )}
                {activeTab === "security" && <AdminSecurity />}
            </div>
        </div>
    );
}
