const io = require('socket.io-client');
const Chart = require('chart.js');
const hexrgb = require('hex-rgb');

(() => {
	'use strict';
	const socket = io();
	const elements = {
		chart: document.getElementById('power-stats'),
		chartInfo: document.getElementById('chart-info'),
		standList: document.getElementById('generator-stands'),
		generator: document.getElementById('generator-name'),
		deviceList: document.getElementById('stand-devices'),
		total: document.getElementById('total'),
		current: document.getElementById('current'),
		triggers: document.querySelectorAll('.trigger-element')
	};

	let chartColor = '#D88080';

	elements.triggers.forEach(trigger => {
		trigger.addEventListener('click', e => {
			chartColor = e.currentTarget.dataset.color;
			updateStream(e.currentTarget.dataset.name, 'stand');
		});
	});

	socket.emit('connection', socket.id);
	socket.emit('get stands');

	socket.on('updated data', data => {
		updateChart(data);
	});

	socket.on('updated total', total => {
		updateTotal(total);
	});

	socket.on('all stands', data => {
		elements.generator.innerText = data.name;

		data.stands.forEach(stand => {
			elements.standList.innerHTML += '<li data-name=' + stand.name + '>' + stand.name + '</li>'
		});

		elements.stands = document.getElementById('generator-stands').childNodes;
		elements.stands.forEach(stand => {
			stand.addEventListener('click', e => {
				updateStream(e.target.dataset.name, 'stand');

			});
		});
	});

	const updateDevicesList = data => {
		if(data === null) {
			return
		};
		let deviceList = '';
		data.devices.forEach(device => {
			deviceList += '<li data-name=' + device.name + '>' + device.name + '<br> current: ' + device.currentUsage.toFixed(4) + ' kW <br> total: ' + device.totalUsage.toFixed(4) + ' kWh</li>'
		});

		elements.deviceList.innerHTML = deviceList;
	};

	const chartContainer = elements.chart;

	const chartOptions = {
		global: {
			maintainAspectRatio: true,
			responsive: true
		},
		legend: {
			display: true
		},
		scales: {
			xAxes: [{
				display: true
			}],
			yAxes: [{
				display: true
			}]
		},
		title: {
			display: true,
			text: ''
		}

	};

	const data = {
		labels: [],
		datasets: [{
			fill: true,
			lineTension: 0,
			backgroundColor: 'rgba(75,123,133,0.4)',
			borderColor: 'rgba(75,123,132,1)',
			borderCapStyle: 'butt',
			borderDash: [],
			borderDashOffset: 0.0,
			borderJoinStyle: 'miter',
			pointBorderColor: 'rgba(75,192,192,1)',
			pointBackgroundColor: '#fff',
			pointBorderWidth: 3,
			pointHoverRadius: 10,
			pointHoverBackgroundColor: 'rgba(75,192,192,1)',
			pointHoverBorderColor: 'rgba(220,220,220,1)',
			pointHoverBorderWidth: 5,
			pointRadius: 3,
			pointHitRadius: 10,
			label: 'current usage (kw)',
			data: []
		}]
	};

	const powerChart = new Chart(chartContainer, {
		type: 'line',
		data,
		options: chartOptions,
		responsive: true
	});

	const updateChart = updateData => {
		data.labels.push(updateData.time);
		data.datasets[0].data.push(updateData.currentUsage);
		data.datasets[0].label='real-time usage for ' + updateData.standName;
		const hex = 	hexrgb(chartColor).join(',');
		data.datasets[0].backgroundColor = 'rgba(' + hex + ', 0.4)';
		data.datasets[0].borderColor = 'rgba(' + hex + ', 1)';

		if (data.datasets[0].data.length === 13) {
			data.datasets[0].data.shift();
			data.labels.shift();
		}

		updateCurrent(updateData.currentUsage);
		updateTotal(updateData.totalUsage);
		updateDevicesList(updateData);

		powerChart.update();
	}

	const updateStream = (name, type) => {
		elements.chartInfo.innerText = 'Real-time data for: ' + name;
		socket.emit('update stream', name, type);
		// socket.emit('get devices', name);
	};

	const updateTotal = total => {
		elements.total.innerText = total.toFixed(4) + ' kWh';
	};

	const updateCurrent = current => {
		elements.current.innerText = current.toFixed(4) + ' kW';
	};
})();
