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
                    display: false
                }
            ],
            yAxes: [
                {
                    display: false
                }
            ]
        }
    };

    var data = {
        labels: [
            "00:00",
            "01:00",
            "02:00",
            "03:00",
            "04:00",
            "05:00",
            "06:00",
            "07:00",
            "08:00",
            "09:00",
            "10:00",
            "11:00",
            "12:00",
            "13:00",
            "14:00",
            "15:00",
            "16:00",
            "17:00",
            "18:00",
            "19:00",
            "20:00",
            "21:00",
            "22:00",
            "23:00"
        ],
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
            }
        ]
    };

    var power_chart = new Chart(chart_container, {
        type: 'line',
        data: data,
        options: chart_options,
        responsive: true
    });

    setInterval(function(){
      data.labels.push('ghvvghhgv');
      data.labels.shift();

      data.datasets[0].data.push(70);
      data.datasets[0].data.shift();
      
      console.log('data added');
      power_chart.update();
    }, 300);


})();
