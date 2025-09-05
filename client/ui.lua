local function toggleNuiFrame(shouldShow)
    SetNuiFocus(shouldShow, shouldShow)
end

RegisterNUICallback('hideFrame', function(_, cb)
    toggleNuiFrame(false)
    debugPrint('Hide NUI frame')
    cb({})
end)

RegisterNUICallback('GarageSystem:renameVehicle', function(data, cb)
    if #data.newName <= 0 then
        lib.notify({
            description = 'Du skal vælge et navn for at kunne gøre dette!',
            type = 'error',
            position = 'bottom'
        })
    end

    local rename = lib.callback.await('oliver-garagesystem:server:renameVehicle', false, data.newName, data.plate)
end)

RegisterNUICallback('GarageSystem:OpenKeys', function(data, cb)
    toggleNuiFrame(false)
    Wait(500)
    ExecuteCommand('keys')
end)

RegisterNUICallback('GarageSystem:RetrieveVehicle', function(data, cb)
    local vehicles = lib.callback.await('oliver-garagesystem:server:getOwnedVehicles', false)
    local nearestId = getNearestGarageId()

    print(data.plate)

    for _, vehicle in ipairs(vehicles) do
        if vehicle.parking == 'Privat Garage' then
            if vehicle.plate == data.plate then
                local spawnCoords = GetEntityCoords(PlayerPedId())
                local vModel = vehicle.vehicle.model
                local vCoords = spawnCoords
                local vVehicleProperties = vehicle
                local vVehicleOptions = nil

                SpawnVehicle(vModel, vCoords, vVehicleProperties, vVehicleOptions, true)
            end
        else
            if vehicle.plate == data.plate then
                local spawnCoords = nil
                for _, spot in ipairs(Config.GarageSystem[nearestId].GarageSettings.ParkingSpots) do
                    if not IsPositionOccupied(spot.x, spot.y, spot.z, -0.5, false, true, true, false, false, false, 0, false) then
                        spawnCoords = spot
                        break
                    end
                end
                local vModel = vehicle.vehicle.model
                local vCoords = spawnCoords
                local vVehicleProperties = vehicle
                local vVehicleOptions = nil

                if lib.progressBar({
                        duration = 2000,
                        label = 'Henter Køretøjet....',
                        useWhileDead = false,
                        canCancel = false,
                    }) then
                    SpawnVehicle(vModel, vCoords, vVehicleProperties, vVehicleOptions, false)
                end
            end
        end
    end
end)

RegisterNUICallback('GarageSystem:RestoreVehicle', function(data, cb)
    local vehicles = lib.callback.await('oliver-garagesystem:server:getOwnedVehicles', false)
    local nearestId = getNearestGarageId()

    local input = lib.inputDialog('Betalingsmetode', {
        { type = 'select', label = 'Kort eller Kontant', description = 'Vil du betale med kort eller kontant', icon = 'hashtag', options = { { value = 'bank', label = 'Bank' }, { value = 'money', label = 'Kontant' } } },
    })

    if not input then return end

    print(data.plate)

    for _, vehicle in ipairs(vehicles) do
        if vehicle.plate == data.plate then
            local spawnCoords = nil
            for _, spot in ipairs(Config.GarageSystem[nearestId].GarageSettings.ParkingSpots) do
                if not IsPositionOccupied(spot.x, spot.y, spot.z, -0.5, false, true, true, false, false, false, 0, false) then
                    spawnCoords = spot
                    break
                end
            end
            local vModel = vehicle.vehicle.model
            local vCoords = spawnCoords
            local vVehicleProperties = vehicle
            local vVehicleOptions = nil

            if lib.progressBar({
                    duration = 2000,
                    label = 'Henter Køretøjet....',
                    useWhileDead = false,
                    canCancel = false,
                }) then
                SpawnVehicle(vModel, vCoords, vVehicleProperties, vVehicleOptions, false)
            end
        end
    end
end)

function GetVehicles(zoneCategory, GetZone)
    toggleNuiFrame(true)
    SendReactMessage('showUi', true)

    -- Then fetch vehicles asynchronously
    lib.callback('oliver-garagesystem:server:GetVehicles', false, function(vehicles)
        if vehicles then
            local nearestId = getNearestGarageId()
            local vehicle = {}
            if Config.GarageSystem[nearestId].ImpoundZone then
                for k, veh in ipairs(vehicles) do
                    if veh.stored == 0 then
                        local props = type(vehicle.vehicle) == 'string' and json.decode(vehicle.vehicle) or
                            vehicle.vehicle

                        table.insert(vehicle, {
                            vehicleModel = GetDisplayNameFromVehicleModel(props.model),
                            navngivet = veh.navngivet,
                            parking = veh.parking,
                            plate = veh.plate,
                            fuelLevel = props.fuelLevel,
                            bodyHealth = props.bodyHealth,
                            engineHealth = props.engineHealth,
                            model = props.model,
                            vehicle = veh.vehicle,
                        })
                    end
                end

                SendReactMessage('GarageSystem:setVehicles',
                    { vehicles = vehicle, zoneCategory = zoneCategory, zone = GetZone, Impound = false })
            else
                for _, veh in pairs(vehicles) do
                    if veh.stored == 1 then
                        local props = type(veh.vehicle) == 'string' and json.decode(veh.vehicle) or
                            veh.vehicle

                        table.insert(vehicle, {
                            vehicleModel = GetDisplayNameFromVehicleModel(props.model),
                            navngivet = veh.navngivet,
                            parking = veh.parking,
                            plate = veh.plate,
                            fuelLevel = props.fuelLevel,
                            bodyHealth = props.bodyHealth,
                            engineHealth = props.engineHealth,
                            model = props.model,
                            vehicle = veh.vehicle,
                        })
                    end
                end

                SendReactMessage('GarageSystem:setVehicles',
                    { vehicles = vehicle, zoneCategory = zoneCategory, zone = GetZone, Impound = false })
            end
        else
            SendReactMessage('GarageSystem:setVehicles', { vehicles = {}, zoneCategory = zoneCategory, zone = GetZone })
        end
    end)
end

function GetPrivateVehicles(GetZone)
    toggleNuiFrame(true)
    SendReactMessage('showUi', true)

    lib.callback('oliver-garagesystem:server:GetVehicles', false, function(vehicles)
        if vehicles then
            local vehicle = {}
            local zoneCategory = getZoneCategory(GetZone)
            for k, veh in pairs(vehicles) do
                if veh.parking == 'Privat Garage' then
                    local props = type(veh.vehicle) == 'string' and json.decode(veh.vehicle) or
                        veh.vehicle

                    table.insert(vehicle, {
                        vehicleModel = GetDisplayNameFromVehicleModel(props.model),
                        navngivet = veh.navngivet,
                        parking = veh.parking,
                        plate = veh.plate,
                        fuelLevel = props.fuelLevel,
                        bodyHealth = props.bodyHealth,
                        engineHealth = props.engineHealth,
                        model = props.model,
                        vehicle = veh.vehicle,
                    })
                end
            end

            SendReactMessage('GarageSystem:setVehicles',
                { vehicles = vehicle, zoneCategory = zoneCategory, zone = GetZone, Impound = false })
        end
    end)
end

exports("GetPrivateVehicles", GetPrivateVehicles)
