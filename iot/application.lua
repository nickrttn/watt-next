local request = require 'request'
local api_endpoint = "watt-next-api.herokuapp.com"

local timer = tmr.create()
local channel = 0

request.get(
    api_endpoint,
    '/api/v1/init/stand/nicks-tacos/real-device/taco-grill/label/B',
    function(res)
        local has_success = string.match(res, "success")
        if (string.match(res, "success")) then
            print("success")
            startPolling()
        end
    end
)

function send_readout()
    print("poll")
    local readout = adc.read(channel)
    print(readout)
    request.get(
        api_endpoint,
        '/api/v1/real-device/taco-grill/watt/' .. readout,
        function(res)
            print(res)
            print("sent current usage")
        end
    )
end

function startPolling()
    print("start polling")
    timer:register(100000, tmr.ALARM_AUTO, function()
        send_readout()
    end)
    timer:start()
end
