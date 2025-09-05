import React, { useState } from "react";
import { Vehicle } from "@/app/types";
import StatBar from "@/app/components/StatBar";
import { faBolt, faCar, faGasPump, faGaugeHigh, faKey, faPenToSquare, faTruckRampBox } from "@fortawesome/free-solid-svg-icons";
import LibIcon from "@/components/LibIcon";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fetchNui } from "@/utils/fetchNui";
import { useVisibility } from "@/app/visibility/VisibilityContext";
import { FaMapMarkerAlt } from "react-icons/fa";

type Props = {
    vehicle: Vehicle;
    index?: number;
    onRename?: (index: number, newName: string, plate: string) => void;
    isImpound?: boolean;
};

const VehicleRow: React.FC<Props> = ({ vehicle, index = 0, onRename, isImpound = false }) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(vehicle.name);
    const { setVisible } = useVisibility();

    const confirmRename = () => {
        if (!onRename) return setOpen(false);
        const trimmed = name.trim();
        if (trimmed.length === 0) return;
        onRename(index, trimmed, vehicle.plate);
        setOpen(false);
    };

    const handleKeys = () => {
        setVisible(false);
        fetchNui('hideFrame').catch((e) => {
            console.error("Failed to close frame:", e)
        });

        fetchNui('GarageSystem:OpenKeys').catch((e) => {
            console.error("Something went wrong!")
        });
    }

    const handleRetrieve = (isImpound: boolean) => {
        if (isImpound) {
            setVisible(false);
            fetchNui('hideFrame').catch((e) => {
                console.error("Failed to close frame:", e)
            });

            fetchNui('GarageSystem:RestoreVehicle', { plate: vehicle.plate }).catch((e) => {
                console.error("Something went wrong!")
            });
        } else {
            setVisible(false);
            fetchNui('hideFrame').catch((e) => {
                console.error("Failed to close frame:", e)
            });

            fetchNui('GarageSystem:RetrieveVehicle', { plate: vehicle.plate }).catch((e) => {
                console.error("Something went wrong!")
            });
        }
    }

    return (
        <div className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors min-h-[132px]">
            <div className="flex items-center justify-between px-4 pt-3">
                <div className="flex items-center gap-2 min-w-[30rem] max-w-[30rem]">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-semibold tracking-wider uppercase bg-neutral-900/40 border border-white/10 rounded px-2 py-0.5 truncate max-w-[75%]">
                        {vehicle.name}
                    </span>
                    <div className="flex flex-row items-center gap-1">
                        <FaMapMarkerAlt className="text-foreground/70" size={12} />
                        <span className="text-xs text-foreground/70 font-medium shrink-0">{vehicle.parking}</span>
                    </div>
                </div>
                <div className="text-xs text-foreground/70 font-medium shrink-0">
                    {vehicle.plate ?? "—"}
                </div>
            </div>

            <div className="px-4 py-3 space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-14 text-[11px] text-foreground/70 flex items-center gap-1">
                        <LibIcon icon={faGasPump} className="h-3 w-3 text-foreground/80" />
                        <span>Benzin</span>
                    </div>
                    <div className="flex-1">
                        <StatBar label="" value={vehicle.fuelLevel} icon={faGasPump} barGradient="bg-emerald-500" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-14 text-[11px] text-foreground/70 flex items-center gap-1">
                        <LibIcon icon={faGaugeHigh} className="h-3 w-3 text-foreground/80" />
                        <span>Motor</span>
                    </div>
                    <div className="flex-1">
                        <StatBar label="" value={vehicle.engineHealth} icon={faGaugeHigh} barGradient="bg-emerald-500" />
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-14 text-[11px] text-foreground/70 flex items-center gap-1">
                        <LibIcon icon={faCar} className="h-3 w-3 text-foreground/80" />
                        <span>Karosseri</span>
                    </div>
                    <div className="flex-1">
                        <StatBar label="" value={vehicle.bodyHealth} icon={faCar} barGradient="bg-emerald-500" />
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4">
                <div className="grid grid-cols-3 gap-3">
                    <button onClick={() => handleRetrieve(isImpound)} className={`rounded-md border text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2 ${isImpound ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border-rose-400/25' : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-emerald-400/25'}`}>
                        <LibIcon icon={faTruckRampBox} className="h-3.5 w-3.5" />
                        {isImpound ? 'Udkøb Køretøj' : 'Hent Køretøj'}
                    </button>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="rounded-md bg-white/5 text-foreground/80 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2">
                                <LibIcon icon={faPenToSquare} className="h-3.5 w-3.5" />
                                Omdøb Kaldenavn
                            </button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-800/60 backdrop-blur-md border-white/10">
                            <DialogHeader>
                                <DialogTitle>Ændre Køretøjets Navn</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-2">
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter new name"
                                    className="bg-neutral-900/40 border border-white/10"
                                />
                            </div>
                            <DialogFooter>
                                <div className="flex w-full justify-end gap-2 pt-2">
                                    <Button variant="ghost" className="rounded-md bg-white/5 text-foreground/80 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2" onClick={() => setOpen(false)}>Anullere</Button>
                                    <Button className="rounded-md bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-400/25 text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2" onClick={confirmRename}>Ændre Navn</Button>
                                </div>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <button onClick={handleKeys} className="rounded-md bg-white/5 text-foreground/80 hover:bg-white/10 border border-white/10 text-xs font-medium flex items-center justify-center gap-2 transition px-3 py-2">
                        <LibIcon icon={faKey} className="h-3.5 w-3.5" />
                        Nøgler
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VehicleRow;


