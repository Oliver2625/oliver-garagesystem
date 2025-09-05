lib.callback.register('oliver-garagesystem:server:GetVehicles', function(source)
    local xPlayer = ESX.GetPlayerFromId(source)
    local vehicles = MySQL.query.await('SELECT * FROM owned_vehicles WHERE owner = ?', { xPlayer.identifier })
    return vehicles
end)

lib.callback.register('oliver-garagesystem:server:renameVehicle', function(source, newName, plate)
    print(newName, plate)
    local vehicles = MySQL.query.await('UPDATE owned_vehicles SET navngivet = ? WHERE plate = ?',
        { newName, plate })
    return vehicles
end)

lib.callback.register('oliver-garagesystem:server:getOwnedVehicles', function(source)
    local vehicles = {}
    local xPlayer = ESX.GetPlayerFromId(source)

    if xPlayer then
        local identifier = xPlayer.getIdentifier()

        local result = MySQL.query.await(
            'SELECT * FROM owned_vehicles WHERE owner = ? AND type = ? ORDER BY navngivet ASC', { identifier, 'car' })

        if result then
            for _, row in ipairs(result) do
                local vehicleData = json.decode(row.vehicle)

                local timestampInSeconds = tonumber(row.date_ending)

                if timestampInSeconds then
                    timestampInSeconds = timestampInSeconds / 1000

                    local timeTable = os.date("*t", timestampInSeconds)

                    local dateEnding = string.format("%04d-%02d-%02d", timeTable.year, timeTable.month, timeTable.day)

                    table.insert(vehicles, {
                        parking = row.parking,
                        vehicle = vehicleData,
                        stored = tonumber(row.stored),
                        navngivet = tostring(row.navngivet),
                        plate = row.plate,
                        isleasing = row.isleasing,
                        date_ending = dateEnding
                    })
                else
                    table.insert(vehicles, {
                        parking = row.parking,
                        vehicle = vehicleData,
                        stored = tonumber(row.stored),
                        navngivet = tostring(row.navngivet),
                        plate = row.plate,
                        isleasing = row.isleasing,
                        date_ending = "Unknown"
                    })
                end
            end
        end
    end

    return vehicles
end)

lib.callback.register('oliver-garagesystem:server:storeVehicle', function(source, plate, zoneCategory, vehicleProperties)
    local vehicles = MySQL.query.await('UPDATE owned_vehicles SET stored = 1, vehicle = ?, parking = ? WHERE plate = ?',
        { json.encode(vehicleProperties), zoneCategory, plate })
    return vehicles
end)

lib.callback.register('oliver-garagesystem:server:storeInPrivateGarage',
    function(source, plate, zoneCategory, vehicleProperties)
        local vehicles = MySQL.query.await(
            'UPDATE owned_vehicles SET stored = 1, vehicle = ?, parking = ? WHERE plate = ?',
            { json.encode(vehicleProperties), 'Privat Garage', plate })
        return vehicles
    end)

lib.callback.register('oliver-garagesystem:server:setVehicleOut', function(source, plate)
    local xPlayer = ESX.GetPlayerFromId(source)
    local playerIdentifier = xPlayer.getIdentifier()

    exports['t1ger_keys']:UpdateKeysToDatabase(plate, true)

    local updateQuery = [[
        UPDATE owned_vehicles
        SET stored = 0
        WHERE owner = @owner AND plate = @plate
    ]]

    local updateResult = MySQL.Sync.execute(updateQuery, {
        ['@owner'] = playerIdentifier,
        ['@plate'] = plate
    })

    return updateResult > 0
end)
