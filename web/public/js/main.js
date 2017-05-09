(function() {
    'use strict';

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
            xAxes: [
                {
                    display: true
                }
            ],
            yAxes: [
                {
                    display: true
                }
            ]
        }
    };

    var data = {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        datasets: [
            {
                fill: false,
                lineTension: 0,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
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
                data: [
                    65,
                    59,
                    80,
                    81,
                    56,
                    55,
                    40,
                    23,
                    33,
                    45,
                    56,
                    66,
                    25,
                    59,
                    80,
                    81,
                    56,
                    55,
                    40,
                    23,
                    33,
                    45,
                    56,
                    66
                ]
            },
            {
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
                data: [
                    65,
                    59,
                    80,
                    81,
                    56,
                    55,
                    40,
                    23,
                    33,
                    45,
                    56,
                    66,
                    25,
                    59,
                    80,
                    81,
                    56,
                    55,
                    40,
                    23,
                    33,
                    45,
                    56,
                    66
                ]
            }
        ]
    };

    var power_chart = new Chart(chart_container, {
        type: 'line',
        data: data,
        options: chart_options,
        responsive: true
    });

    var counter = 10;

    setInterval(function(){

      data.labels.push(counter++);
      data.labels.shift();

      data.datasets[0].data.push(70);
      data.datasets[0].data.shift();
      data.datasets[1].data.push(90);
      data.datasets[1].data.shift();

      console.log('data added');
      power_chart.update();
    }, 300);


})();
