import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    className?: string;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    description,
    className,
}: StatsCardProps) {
    return (
        <div className={`stat-card flex flex-col gap-1 ${className || ''}`}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-black/70">{title}</span>
                {Icon && <Icon className="h-5 w-5 text-violet-500" />}
            </div>
            <span className="text-3xl font-bold text-black">{value}</span>
            {description && (
                <span className="text-xs text-black/60">{description}</span>
            )}
        </div>
    );
}
