// Copyright (c) Han Lee.
// Distributed under the terms of the Modified BSD License.

'use strict';

var tracer = require('./tracer');
var _ = require('underscore');
var Chart = require('chart.js');

var ChartTracerView = tracer.TracerView.extend({

    _create_object: function () {
        // Create canvas: chart.js works on canvas
        this.ctx = document.createElement('canvas');
        this.el.appendChild(this.ctx);
        // set chart
        this.tracerChart = new Chart(this.ctx, this.chartOption);
    },

    _initialize_data: function () {
        // default chart.js option
        this.chartOption = {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: []
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                animation: false,
                legend: false,
                responsive: true,
                maintainAspectRatio: false
            }
        };

        // set data
        var data = this.model.get('data');
        this.chartOption['data']['datasets'][0]['data'] = data;

        // set chart background color
        this.backgroundColor = [];
        for (var i in data) {
            this.backgroundColor[i] = this.model.get('defaultColor');
        }
        this.chartOption['data']['datasets'][0]['backgroundColor'] = this.backgroundColor;

        // set label
        this.chartOption['data']['labels'] = this.model.get('labels');
    },

    _data_change: function () {
        // update data
        this.tracerChart.config.data.datasets[0].data = this.model.get('data');
        this.tracerChart.update();
    },

    _selected_change: function () {
        // clear background
        var previous_visited = this.model.get('visited');
        var previous_selected = this.model.previous('selected');
        if(previous_visited != -1){
            this.backgroundColor[previous_visited] = this.model.get('defaultColor');
        }
        if(previous_selected != -1){
            this.backgroundColor[previous_selected] = this.model.get('defaultColor');
        }

        // set background
        this.backgroundColor[this.model.get('selected')] = this.model.get('selectedColor');
        this.tracerChart.config.data.datasets[0].backgroundColor = this.backgroundColor;
        this.tracerChart.update();
    },
    
    _visited_change: function () {
        // clear background
        var previous_visited = this.model.previous('visited');
        var previous_selected = this.model.get('selected');
        if(previous_visited != -1){
            this.backgroundColor[previous_visited] = this.model.get('defaultColor');
        }
        if(previous_selected != -1){
            this.backgroundColor[previous_selected] = this.model.get('defaultColor');
        }

        // set background
        this.backgroundColor[this.model.get('visited')] = this.model.get('visitedColor');
        this.tracerChart.config.data.datasets[0].backgroundColor = this.backgroundColor;
        this.tracerChart.update();
    }
});

var ChartTracerModel = tracer.TracerModel.extend({
    defaults: _.extend({}, tracer.TracerModel.prototype.defaults, {
        _view_name : 'ChartTracerView',
        _model_name : 'ChartTracerModel'
    })
});

module.exports = {
    ChartTracerView: ChartTracerView,
    ChartTracerModel: ChartTracerModel
};