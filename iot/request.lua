local request = {}

function request.get(host, path, cb)
    local sck = tls.createConnection()

    print("request.get")

    sck:on('connection', function(s)
        print("request.get conn")
        s:send('GET ' .. path .. ' HTTP/1.0\r\n' ..
                     'Connection: close\r\n' ..
                     'Host: ' .. host .. '\r\n' ..
                     '\r\n')
    end)

    sck:on('receive', function(s, res)
        print("request.get rec")
        cb(res)
        s:close()
    end)

    sck:connect(443, host)
end

function request.post(host, path, body, cb)
    local sck = tls.createConnection()

    sck:on('connection', function(s)
        s:send('POST ' .. path .. ' HTTP/1.0\r\n' ..
                     'Connection: close\r\n' ..
                     'Host: ' .. host .. '\r\n' ..
                     '\r\n')
        s:send(body)
    end)

    sck:on('receive', function(s, res)
        cb(res)
        s:close()
    end)

    sck:connect(443, host)
end

return request
