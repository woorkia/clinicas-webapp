"use client";

import { useState } from "react";
import { ServiceCatalog } from "@/components/automation/ServiceCatalog";
import { AvailabilityRules } from "@/components/automation/AvailabilityRules";
import { WebhookLogs } from "@/components/automation/WebhookLogs";
import { BotSettings } from "@/components/automation/BotSettings";
import { Settings, Clock, List, Activity } from "lucide-react";
import { clsx } from "clsx";

export default function AutomationPage() {
    const [activeTab, setActiveTab] = useState<"services" | "availability" | "logs" | "settings">("services");

    const tabs = [
        { id: "services", label: "Catálogo de Servicios", icon: List },
        { id: "availability", label: "Horarios y Reglas", icon: Clock },
        { id: "settings", label: "Configuración Bot", icon: Settings },
        { id: "logs", label: "Logs de Actividad", icon: Activity },
    ] as const;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Automatización e IA</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Configura cómo tu asistente de WhatsApp gestiona las citas y servicios.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100/50 p-1 rounded-xl w-fit">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={clsx(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                isActive
                                    ? "bg-white text-primary shadow-sm ring-1 ring-border"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                            )}
                        >
                            <Icon size={16} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden min-h-[500px]">
                {activeTab === "services" && <ServiceCatalog />}
                {activeTab === "availability" && <AvailabilityRules />}
                {activeTab === "settings" && <BotSettings />}
                {activeTab === "logs" && <WebhookLogs />}
            </div>
        </div>
    );
}
