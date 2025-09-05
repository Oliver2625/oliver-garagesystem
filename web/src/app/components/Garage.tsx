import React, { useMemo, useState } from "react";
import { Vehicle, DatabaseVehicle } from "@/app/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import VehicleRow from "./VehicleRow";
import { IoMdClose } from "react-icons/io";
import { useNuiEvent } from "@/hooks/useNuiEvent";
import { fetchNui } from "@/utils/fetchNui";
import { useVisibility } from "@/app/visibility/VisibilityContext";

type VehiclesPayload = {
    vehicles: DatabaseVehicle[];
    zoneCategory: string;
    zone: string;
    Impound: boolean;
};

const parseDatabaseVehicles = (dbVehicles: DatabaseVehicle[]): Vehicle[] => {
    return dbVehicles.map(dbVehicle => {
        try {
            const vehicleData = JSON.parse(dbVehicle.vehicle);

            const normalizeHealth = (value: number) => {
                if (value > 100) return Math.round((value / 1000) * 100);
                return value;
            };

            return {
                name: dbVehicle.navngivet || dbVehicle.vehicleModel,
                parking: dbVehicle.parking,
                plate: dbVehicle.plate,
                fuelLevel: vehicleData.fuelLevel || 0,
                bodyHealth: normalizeHealth(vehicleData.bodyHealth || 0),
                engineHealth: normalizeHealth(vehicleData.engineHealth || 0),
                model: vehicleData.model ? vehicleData.model.toString() : "Unknown"
            };
        } catch (error) {
            console.error("Error parsing vehicle data:", error);
            return {
                name: dbVehicle.navngivet || "Unnamed Vehicle",
                parking: dbVehicle.parking,
                plate: dbVehicle.plate,
                fuelLevel: 0,
                bodyHealth: 0,
                engineHealth: 0,
                model: "Unknown"
            };
        }
    });
};

type GarageProps = {
    vehicles?: Vehicle[];
    title?: string;
};

const Garage: React.FC<GarageProps> = ({ vehicles = [], title = "Garage" }) => {
    const [list, setList] = useState<Vehicle[]>(vehicles);
    const [loading, setLoading] = useState<boolean>(true);
    const [query, setQuery] = useState<string>("");
    const { setVisible } = useVisibility();
    const [zone, setZone] = useState('');
    const [zoneImpound, setZoneImpound] = useState(false);

    useNuiEvent<VehiclesPayload>("GarageSystem:setVehicles", ({ vehicles, zoneCategory, zone, Impound }) => {
        if (!Array.isArray(vehicles)) {
            console.error("setVehicles received non-array vehicles:", vehicles);
            return;
        }

        const parsedVehicles = parseDatabaseVehicles(vehicles);
        setList(parsedVehicles);
        setZone(zone);
        setZoneImpound(Impound);
        setLoading(false);
    });

    useNuiEvent<boolean>("showUi", (isVisible) => {
        if (isVisible) setLoading(true);
    });

    const handleRename = (index: number, newName: string, vehiclePlate: string) => {
        fetchNui('GarageSystem:renameVehicle', { newName: newName, plate: vehiclePlate }).catch((e) => {
            console.error("Something went wrong!")
        });

        setList((prev) => {
            return prev.map((v) => (v.plate === vehiclePlate ? { ...v, name: newName } : v));
        });
    };

    const vehicleCount = useMemo(() => list.length, [list.length]);

    const filteredVehicles = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return list;
        return list.filter((v) => {
            const name = (v.name || "").toLowerCase();
            const plate = (v.plate || "").toLowerCase();
            const model = (v.model || "").toString().toLowerCase();
            return name.includes(q) || plate.includes(q) || model.includes(q);
        });
    }, [list, query]);

    const sortedVehicles = useMemo(() => {
        const sorted = [...filteredVehicles].sort((a, b) => a.name.localeCompare(b.name));
        return sorted;
    }, [filteredVehicles]);

    return (
        <div className="w-full max-w-3xl font-[Poppins]">
            {/* Panel */}
            <div className="rounded border border-white/10 bg-neutral-900 overflow-hidden">
                {/* Header */}
                <div className="px-5 pt-4 pb-3 bg-neutral-800/60 border-b border-white/10">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold tracking-wide">{zone}</h2>
                        <div className="flex flex-row items-center gap-2 text-foreground/60 text-sm">
                            <span className="hidden sm:inline">{vehicleCount} Køretøjer</span>
                            <button
                                onClick={() => {
                                    setVisible(false);
                                    fetchNui('hideFrame').catch((e) => {
                                        console.error("Failed to close frame:", e)
                                    });
                                }}
                                className="rounded-md bg-white/5 text-foreground/80 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2"
                            >
                                <IoMdClose />
                            </button>
                        </div>
                    </div>
                    <div className="mt-3">
                        <input
                            type="text"
                            placeholder="Søg: Nummerplade, Bil Model, Kaldenavn..."
                            className="w-full h-10 px-3.5 rounded-md bg-neutral-900/60 text-sm placeholder:text-foreground/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400/40 transition"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[620px] overflow-y-auto">
                    <div className="p-4 space-y-3.5">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="rounded-lg border border-white/10 bg-white/5 animate-pulse">
                                    <div className="flex justify-between px-4 pt-3 pb-3">
                                        <div className="h-4 w-40 bg-white/10 rounded" />
                                        <div className="h-3 w-24 bg-white/10 rounded" />
                                    </div>
                                    <div className="px-4 pb-4 space-y-3">
                                        <div className="h-3 w-full bg-white/10 rounded" />
                                        <div className="h-3 w-full bg-white/10 rounded" />
                                        <div className="h-3 w-full bg-white/10 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : sortedVehicles.length === 0 ? (
                            <div className="text-center px-[7.5rem] py-6 text-foreground/60">
                                <p>Ingen Biler Fundet</p>
                                <p className="text-sm mt-1">Er dette en fejl, rapporter det til en staff</p>
                            </div>
                        ) : (
                            sortedVehicles.map((v, idx) => (
                                <VehicleRow key={v.plate} vehicle={v} index={idx} onRename={handleRename} isImpound={zoneImpound} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Garage;


