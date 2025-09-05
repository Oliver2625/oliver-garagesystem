export type Vehicle = {
    name: string;
    parking: string;
    plate: string;
    fuelLevel: number;
    bodyHealth: number;
    engineHealth: number;
    model?: string;
};

export type DatabaseVehicle = {
    parking: string;
    plate: string;
    navngivet: string;
    modelname: string;
    vehicle: string;
    [key: string]: any;

}
