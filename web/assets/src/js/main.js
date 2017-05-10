(function() {
    'use strict';
    var socket = io();

    // socket.emit('connection', socket.id);

    socket.on('updated data', function(data) {
        updateChart(data)
    });

    var chart_container = document.getElementById('power-stats');

    var chart_options = {
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
        }
    };

    var data = {
        labels: [],
        datasets: [{
            fill: false,
            lineTension: 0,
            backgroundColor: "rgba(75,123,133,0.4)",
            borderColor: "rgba(75,123,132,1)",
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 3,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 5,
            pointRadius: 3,
            pointHitRadius: 10,
            data: []
        }]
    };

    var power_chart = new Chart(chart_container, {
        type: 'line',
        data: data,
        options: chart_options,
        responsive: true
    });

    function updateChart(updateData) {

        data.labels.push(updateData.messages[4].time);
        data.datasets[0].data.push(updateData.messages[4].avr_va);
        if (data.datasets[0].data.length == 10) {
            data.datasets[0].data.shift();
            data.labels.shift();
        }

        power_chart.update();
    }
})();
