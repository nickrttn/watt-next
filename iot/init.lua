-- load credentials, 'SSID' and 'PASSWORD' declared and initialize in there
local wifimodule = require 'wifimodule'

function startup()
    if file.open('init.lua') == nil then
        print('init.lua deleted or renamed')
    else
        file.close('init.lua')
        -- the actual application is stored in 'application.lua'
        dofile('application.lua')
--        Als dit de application.lua moet starten doet ie het niet
    end
end

wifimodule.connect(startup)
