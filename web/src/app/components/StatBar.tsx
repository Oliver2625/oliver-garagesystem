import React, { useEffect, useMemo, useState } from "react";
import LibIcon from "@/components/LibIcon";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type StatBarProps = {
    label: string;
    value: number;
    icon: IconDefinition;
    barGradient?: string;
};

const clampPercent = (n: number): number => {
    if (Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(100, Math.round(n)));
};

const StatBar: React.FC<StatBarProps> = ({ label, value, icon, barGradient }) => {
    const [animatedWidth, setAnimatedWidth] = useState(0);
    const safeValue = useMemo(() => clampPercent(value), [value]);

    useEffect(() => {
        const id = setTimeout(() => setAnimatedWidth(safeValue), 50);
        return () => clearTimeout(id);
    }, [safeValue]);

    return (
        <div className="px-2">
            <div className="w-full">
                <div className={label ? "flex items-center justify-between text-xs text-foreground/80 mb-1" : "hidden"}>
                    <div className="flex items-center gap-2">
                        <LibIcon icon={icon} className="h-3.5 w-3.5 text-foreground/90" />
                        <span className="tracking-wide">{label}</span>
                    </div>
                    <span className="tabular-nums font-medium">{safeValue}%</span>
                </div>
                <div className="h-3.5 rounded-md bg-white/10 p-0.5 overflow-hidden">
                    <div
                        className={
                            "h-full rounded-md will-change-[width] transition-[width] duration-700 ease-out " +
                            (barGradient ?? "bg-emerald-500")
                        }
                        style={{ width: `${animatedWidth}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatBar;


