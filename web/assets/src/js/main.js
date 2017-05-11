const io = require('socket.io-client');
const Chart = require('chart.js');

(() => {
	'use strict';
	const socket = io();
	const elements = {
		chart: document.getElementById('power-stats'),
		standList: document.getElementById('generator-stands'),
		generator: document.getElementById('generator-name'),
		deviceList: document.getElementById('stand-devices'),
		total: document.getElementById('total')
	};

	socket.emit('connection', socket.id);
	socket.emit('get stands');

	socket.on('updated data', data => {
		updateChart(data);
	});

	socket.on('updated total', total => {
		updateTotal(total);
	});

	socket.on('all stands', data => {
		elements.generator.innerText = data.generatorName;

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

	socket.on('update devices', data => {
		if(data === null) {
			return
		};
		let deviceList = '';
		data.devices.forEach(device => {
			deviceList += '<li data-name=' + device.name + '>' + device.name + '</li>'
		});

		elements.deviceList.innerHTML = deviceList;
		elements.devices = document.getElementById('stand-devices').childNodes;
		elements.devices.forEach(device => {
			device.addEventListener('click', e => {
				updateStream(e.target.dataset.name, 'device');
			});
		});
	});

	const chartContainer = elements.chart;

	const chartOptions = {
		global: {
			maintainAspectRatio: true,
			responsive: true
		},
		legend: {
			display: false
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
		data.labels.push(updateData.messages[0].time);
		data.datasets[0].data.push(updateData.messages[0].avr_va);

		if (data.datasets[0].data.length === 13) {
			data.datasets[0].data.shift();
			data.labels.shift();
		}

		powerChart.update();
	}

	const updateStream = (name, type) => {
		socket.emit('update stream', name, type);
		socket.emit('get devices', name);
	};

	const updateTotal = total => {
		elements.total.innerText = total.toFixed(1) + ' va';
	}
})();
