(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";!function(){function e(e){i.labels.push(e.messages[0].time),i.datasets[0].data.push(e.messages[0].avr_va),10==i.datasets[0].data.length&&(i.datasets[0].data.shift(),i.labels.shift()),r.update()}var t=io(),a={chart:document.getElementById("power-stats"),stands:document.getElementById("stands-list")};t.emit("connection",t.id),t.on("updated data",function(t){e(t);var o="";t.devices.forEach(function(e){o+="<li data-device="+e.name+">"+e.name+"</li>"}),a.devices.innerHTML=o});var o=a.chart,s={global:{maintainAspectRatio:!0,responsive:!0},legend:{display:!1},scales:{xAxes:[{display:!0}],yAxes:[{display:!0}]},title:{display:!0,text:""}},i={labels:[],datasets:[{fill:!0,lineTension:0,backgroundColor:"rgba(75,123,133,0.4)",borderColor:"rgba(75,123,132,1)",borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",pointBorderColor:"rgba(75,192,192,1)",pointBackgroundColor:"#fff",pointBorderWidth:3,pointHoverRadius:10,pointHoverBackgroundColor:"rgba(75,192,192,1)",pointHoverBorderColor:"rgba(220,220,220,1)",pointHoverBorderWidth:5,pointRadius:3,pointHitRadius:10,data:[]}]},r=new Chart(o,{type:"line",data:i,options:s,responsive:!0})}();

},{}]},{},[1]);
