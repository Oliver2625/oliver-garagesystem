import React from "react";
import { Vehicle } from "@/app/types";
import StatBar from "@/app/components/StatBar";
import { faCar, faGaugeHigh, faGasPump } from "@fortawesome/free-solid-svg-icons";

type VehicleCardProps = {
    vehicle: Vehicle;
};

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle }) => {
    return (
        <div
            className="group relative rounded-xl bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden transition-transform duration-300 hover:-translate-y-1"
        >
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute -inset-24" />
            </div>

            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold tracking-wide">{vehicle.name}</h3>
                        <p className="text-xs text-foreground/60 uppercase tracking-wider">{vehicle.model}</p>
                    </div>
                    <div className="px-2 py-1 rounded-md text-[10px] uppercase tracking-wider bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-cyan-200 border border-cyan-400/30">
                        Owned
                    </div>
                </div>

                <div className="mt-4 grid gap-3">
                    <StatBar label="Engine" value={vehicle.engineHealth} icon={faGaugeHigh} barGradient="bg-gradient-to-r from-emerald-400 to-cyan-400" />
                    <StatBar label="Body" value={vehicle.bodyHealth} icon={faCar} barGradient="bg-gradient-to-r from-sky-400 to-fuchsia-500" />
                    <StatBar label="Fuel" value={vehicle.fuelLevel} icon={faGasPump} barGradient="bg-gradient-to-r from-amber-400 to-rose-500" />
                </div>
            </div>
        </div>
    );
};

export default VehicleCard;


