import { LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: "blue" | "green" | "purple" | "orange";
}

export function StatsCard({ title, value, icon: Icon, trend, trendUp, color = "blue" }: StatsCardProps) {
    const colorMap = {
        blue: "bg-blue-50 text-blue-600",
        green: "bg-green-50 text-green-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600",
    };

    return (
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                {trend && (
                    <p className={clsx("text-xs font-medium mt-1 flex items-center", trendUp ? "text-green-600" : "text-red-600")}>
                        {trendUp ? "+" : ""}{trend}
                        <span className="text-gray-400 ml-1 font-normal">vs mes anterior</span>
                    </p>
                )}
            </div>
            <div className={clsx("p-3 rounded-lg", colorMap[color])}>
                <Icon size={24} />
            </div>
        </div>
    );
}
