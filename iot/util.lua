local util, delay = {}, 0

function util.calibrate_muxer(a, b, c)
	gpio.write(mux_0, a)
	gpio.write(mux_1, b)
	gpio.write(mux_2, c)
end

function util.debounce(time, callback)
	x = tmr.now()
	if x > delay then
		delay = tmr.now() + time
		callback()
	end
end

function util.send_event(evt, ...)
	i2c.start(i2c_id)
	i2c.address(i2c_id, dev_addr, i2c.TRANSMITTER)
	i2c.write(i2c_id, evt, unpack(arg))
	i2c.stop(i2c_id)
end

function util.send_percentage(pct)
	util.debounce(250000, function()
		util.send_event('p', pct)
	end)
end

function util.parse_json(body)
	local json = body:sub(body:find("{"), body:len())
	local t = cjson.decode(json)
	return t
end

function util.encode_json(t)
	local json = cjson.encode(t)
	return json
end

return util
