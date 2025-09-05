local Created = false
local HasBeenUpdated = false

function onEnter(self)
    local Label = '[E] - Garage'

    if IsPedSittingInAnyVehicle(PlayerPedId()) then
        Label = '[E] - Parker Køretøjet'
    else
        Label = '[E] - Garage'
    end

    lib.showTextUI(Label, {
        position = "left-center",
        icon = 'car',
    })
end

function inside()
    if IsPedSittingInAnyVehicle(PlayerPedId()) then
        if not HasBeenUpdated then
            local Label = '[E] - Parker Køretøjet'

            lib.showTextUI(Label, {
                position = "left-center",
                icon = 'car',
            })

            HasBeenUpdated = true
        end
    else
        if HasBeenUpdated then
            local Label = '[E] - Garage'

            lib.showTextUI(Label, {
                position = "left-center",
                icon = 'car',
            })

            HasBeenUpdated = false
        end
    end

    if IsControlJustPressed(0, 38) then
        if IsPedSittingInAnyVehicle(PlayerPedId()) then
            local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
            local plate = GetVehicleNumberPlateText(vehicle)
            local entityCoords = GetEntityCoords(PlayerPedId())
            local GetZone = GetNameOfZone(entityCoords.x, entityCoords.y, entityCoords.z)
            local zoneCategory = getZoneCategory(GetZone)
            local vehicleProperties = lib.getVehicleProperties(vehicle)
            lib.callback.await('oliver-garagesystem:server:storeVehicle', false, plate, zoneCategory, vehicleProperties)

            if lib.progressBar({
                    duration = 2000,
                    label = 'Parkere Køretøjet....',
                    useWhileDead = false,
                    canCancel = false,
                }) then
                DeleteEntity(vehicle)

                lib.notify({
                    description = 'Køretøjet er nu parkeret',
                    type = 'success'
                })
            end
        else
            local entityCoords = GetEntityCoords(PlayerPedId())
            local GetZone = GetNameOfZone(entityCoords.x, entityCoords.y, entityCoords.z)
            local zoneCategory = getZoneCategory(GetZone)

            GetVehicles(zoneCategory, GetZone)
        end
    end
end

function onExit(self)
    lib.hideTextUI()
end

function getZoneCategory(zoneCode)
    for category, zones in pairs(Config.Zones) do
        if zones[zoneCode] then
            return category
        end
    end
    return "Los Santos"
end

function CreateGarage()
    local Points = {}

    for k, v in pairs(Points) do
        lib.zones.poly(lib.zones.box(v))
    end

    while ESX.IsPlayerLoaded() and not Created do
        for k, v in pairs(Config.GarageSystem) do
            table.insert(Points, v.GarageSettings.PolyZone)
        end

        print('here')

        for k, v in pairs(Points) do
            lib.zones.poly({
                points = v,
                thickness = 10,
                debug = false,
                onEnter = onEnter,
                onExit = onExit,
                inside = inside
            })
        end

        Created = true

        Wait(1)
    end
end

function SpawnVehicle(model, coords, vehicleProperties, vehicleOptions, warp)
    ESX.Game.SpawnVehicle(model, coords.xyz, coords.w, function(spawnedVehicle)
        if DoesEntityExist(spawnedVehicle) then
            local netId = NetworkGetNetworkIdFromEntity(spawnedVehicle)

            SetNetworkIdCanMigrate(netId, true)
            SetEntityAsMissionEntity(spawnedVehicle, true, true)
            SetVehicleHasBeenOwnedByPlayer(spawnedVehicle, true)
            --TriggerServerEvent("resident:SetEntityOrphanMode", netId, 0)

            if vehicleOptions then
                if vehicleOptions.livery then SetVehicleLivery(spawnedVehicle, vehicleOptions.livery) end
            end

            if vehicleProperties then
                lib.setVehicleProperties(spawnedVehicle, vehicleProperties.vehicle)
                SetVehicleNumberPlateText(spawnedVehicle, vehicleProperties.vehicle.plate)
                lib.callback.await('oliver-garagesystem:server:setVehicleOut', false, vehicleProperties.vehicle.plate)
                exports['t1ger_keys']:SetVehicleLocked(spawnedVehicle, 0)
                TriggerServerEvent('t1ger_keys:updateOwnedKeys', vehicleProperties.vehicle.plate, true)
            else
                local plate = GetVehicleNumberPlateText(spawnedVehicle)
                exports['t1ger_keys']:SetVehicleLocked(spawnedVehicle, 0)
                exports['t1ger_keys']:GiveTemporaryKeys(plate, 'Firma nøgler', 'Firma')
            end

            if warp then
                TaskWarpPedIntoVehicle(PlayerPedId(), spawnedVehicle, -1)
            end

            lib.notify({
                description = 'Køretøjet holder og venter på dig!',
                type = 'success'
            })

            return spawnedVehicle
        end
    end)
end

local function centroid(points)
    local sx, sy, sz = 0.0, 0.0, 0.0
    local n = #points
    for i = 1, n do
        sx = sx + points[i].x
        sy = sy + points[i].y
        sz = sz + points[i].z
    end
    return vector3(sx / n, sy / n, sz / n)
end

function getNearestGarageId()
    local p = GetEntityCoords(PlayerPedId())
    local nearestId, nearestDist = nil, math.huge

    for id, g in pairs(Config.GarageSystem) do
        local poly = g.GarageSettings and g.GarageSettings.PolyZone
        if poly and #poly > 0 then
            local c = centroid(poly)
            local dist = #(c - p)
            if dist < nearestDist then
                nearestDist = dist
                nearestId = id
            end
        end
    end

    return nearestId
end

function ParkInPrivatGarage()
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    local plate = GetVehicleNumberPlateText(vehicle)
    local entityCoords = GetEntityCoords(PlayerPedId())
    local GetZone = GetNameOfZone(entityCoords.x, entityCoords.y, entityCoords.z)
    local zoneCategory = getZoneCategory(GetZone)
    local vehicleProperties = lib.getVehicleProperties(vehicle)
    lib.callback.await('oliver-garagesystem:server:storeInPrivateGarage', false, plate, zoneCategory, vehicleProperties)

    DeleteEntity(vehicle)

    lib.notify({
        description = 'Køretøjet er nu parkeret',
        type = 'success'
    })
end

exports("ParkInPrivatGarage", ParkInPrivatGarage)

RegisterCommand('startGarage', function()
    CreateGarage()
end, false)
