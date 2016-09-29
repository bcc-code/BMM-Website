'use strict';

angular.module('bmmApp')
    .controller('StatisticCtrl', function ($scope, _api, _statistic, _init) {
        var chart_byDate, chart_bestTrack, chart_listenByDay
            , chart_listenByDay_ctx = '#fraa_kaareList_listenByDay'
            , chart_CustomListenByDate_ctx = '#custom_listenByDay'
            , chart_bestTrack_ctx = '#fraa_kaareList_bestTracks'
            , chart_CustomByTrack_ctx = '#custom_bestTrack'
            , chart_byDate_ctx = '#fraa_kaareList_byDate'
            , chart_CustomByDate_ctx = '#custom_view'
            , background_colors = [];
        $scope.isCustom = false;

        /**
         * Gets a Day by Number 0 => Sunday / 6 => Saturday
         * 
         * @param {int} day (0 - 6)
         * @returns string (Weekday EN)
         */
        function getDayByNumber(day) {
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            return weekday[day]
        }

        /**
         * get random Coloar Array
         * 
         * @param {int} Array size
         * @returns {Array of Strings} 
         */
        function getColorArray(size) {
            if (background_colors.length !== size) {
                for (var i = 0; i < size; i++) {
                    var color = getRandColor();
                    background_colors.push(color);
                }
            }
            return background_colors;
        }

        /**
         * Gets a random dark RGBA Color
         * 
         * @returns {string} random dark RGBA Color
         */
        function getRandColor() {
            var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
            var mix = [1 * 51, 3 * 51, 3 * 51];
            var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function (x) { return Math.round(x / 2.0) })
            return "rgba(" + mixedrgb.join(",") + ", 0.5)";
        }

        this.charts = function () {
            /**
             * Gets a default ChartData Object
             * 
             * @param {any} lbl
             * @param {any} data
             * @param {any} background_colors
             * @returns
             */
            function getDefaultChartDataObj(lbl, data, background_colors) {
                return {
                    label: lbl,
                    data: data,
                    backgroundColor: background_colors,
                    borderWidth: 2
                }
            };

            /**
             * Draws a Chart
             * 
             * @param {ChartDataObj} data
             * @param {$Canvas} Canvas Object
             * @param {any} return Context Object
             * @param {boolean} stacked
             * @param {any} Chart Type
             * @returns {ChartContextObj} ret_ctx
             */
            function drawChart(data, ctx, ret_ctx, stacked, type, lblSuffix, title) {
                if (ret_ctx !== undefined) {
                    updateChartData(ret_ctx, data);
                    return ret_ctx;
                }

                var canvas = angular.element(document.querySelector(ctx));
                var showLines = type === "bar";
                ret_ctx = new Chart(canvas, {
                    type: type,
                    data: data,
                    options: {
                        title: {
                            display: true,
                            text: title ? title : ""
                        },
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItems, data) {
                                    var amount = -1, total, percent = -1;
                                    if (this._chart.config.type === "pie" && lblSuffix === "%") {
                                        amount = data.datasets[tooltipItems.datasetIndex].data[tooltipItems.index];
                                        total = eval(data.datasets[tooltipItems.datasetIndex].data.join("+"));
                                        percent = parseFloat(amount * 100 / total).toFixed(2);
                                    }

                                    var prefix = this._chart.config.type !== "bar" ? data.labels[tooltipItems.index] : data.datasets[tooltipItems.datasetIndex].label;
                                    return prefix + ': ' + (percent > -1 ? percent : tooltipItems.yLabel) + " " + lblSuffix;
                                }
                            }
                        },
                        scales: {
                            xAxes: [{
                                stacked: stacked,
                                display: showLines,
                                gridLines: {
                                    display: showLines
                                }
                            }],
                            yAxes: [{
                                stacked: stacked,
                                display: showLines,
                                gridLines: {
                                    display: showLines
                                }
                            }],
                        }
                    }
                });

                return ret_ctx;
            };

            /**
             * Update chart data
             * 
             * @param {any} chart
             * @param {any} data
             */
            function updateChartData(chart, data) {
                data.datasets.forEach(function (set, i) {
                    set.data.forEach(function (val) {
                        if (chart.config.type === "pie") {
                            chart.data.datasets[i].data[i] += val;
                        } else {
                            chart.data.datasets[i].data.push(val);
                        }
                        if (chart.data.datasets[i].data.length > 15) {
                            chart.data.datasets[i].data.shift();
                        }
                    })

                });
                data.labels.forEach(function (label) {
                    if (chart.config.type !== "pie" || $.inArray(chart.data.labels, label) !== -1) {
                        chart.data.labels.push(label);
                    }

                    if (chart.data.labels.length > 15) {
                        var item = chart.data.labels.shift();
                    }
                });
                chart.update();
            };

            /**
             * Clears a chart
             * 
             * @param {any} chart
             */
            function clearChart(chart) {
                chart.data.datasets.forEach(function (set, i) {
                    set.data = [];
                });
                chart.data.labels = [];
                chart.update();
            };

            return {
                /**
                 * Draws the Fra Kåre Charts
                 */
                drawFraaKaareData: function () {
                    _statistic.getChartListFraKaare().then(function (chartList) {
                        this.drawChart_byDay(chartList, chart_byDate_ctx);
                        this.drawChart_byTrack(chartList, chart_listenByDay_ctx);
                        this.drawChar_mostListend(chartList, chart_bestTrack_ctx);
                    }.bind(this));
                },

                /**
                 * Draws custom Charts
                 * 
                 * @param {Arry of TrackItems} chartList
                 */
                drawCustomData: function (chartList) {
                    if (!chartList) {
                        chartList = [];
                    }

                    this.drawChart_byDay(chartList, chart_CustomByDate_ctx);
                    this.drawChart_byTrack(chartList, chart_CustomByTrack_ctx);
                    this.drawChar_mostListend(chartList, chart_CustomListenByDate_ctx);
                },

                /**
                 * Clear all Charts
                 */
                clearCharts: function () {
                    clearChart(chart_bestTrack);
                    clearChart(chart_byDate);
                    clearChart(chart_listenByDay);
                    this.destroyCharts();
                },

                destroyCharts: function () {
                    chart_bestTrack = undefined;
                    chart_byDate = undefined;
                    chart_listenByDay = undefined;
                },

                /**
                 * Draw Chart by daily Dataset
                 * 
                 * @param {any} list
                 * @param {any} chart_ctx
                 */
                drawChart_byDay: function (list, chart_ctx) {
                    var data = { labels: [], datasets: [] }, background_colors = [], setName, setNamePrefix;
                    list.forEach(function (e, i) {
                        e.names.forEach(function (name, x) {
                            if ($.inArray(name, data.labels) === -1) {
                                data.labels.push(name);
                            }
                        });

                        e.date.setDate(e.date.getDate() - 1);
                        setNamePrefix = i === 0 ? "Until, " : "";
                        setName = setNamePrefix + getDayByNumber(e.date.getDay()).slice(0, 2) + " " + e.date.toLocaleDateString();
                        data.datasets.push(getDefaultChartDataObj(setName, e.values, getColorArray(e.names.length)));

                    });

                    chart_byDate = drawChart(data, chart_ctx, chart_byDate, true, "bar", "New Users", _init.translation.statistic.chartByDateTitle);
                },

                /**
                 * Draw Chart by Tracks
                 * 
                 * @param {any} list
                 * @param {any} ctx
                 */
                drawChart_byTrack: function (list, ctx) {
                    var data = { labels: [], datasets: [] }, days = [0, 0, 0, 0, 0, 0, 0], sums = [];
                    list.forEach(function (day, i) {
                        if (i > 0) {
                            day.values.forEach(function (value, x) {
                                days[day.date.getDay()] += value;
                            });
                        }
                    });
                    days.forEach(function (e, i) {
                        if (e > 0) {
                            data.labels.push(getDayByNumber(i));
                            sums.push(e);
                        }
                    });

                    data.datasets.push(getDefaultChartDataObj("", sums, getColorArray(1)));
                    chart_listenByDay = drawChart(data, ctx, chart_listenByDay, false, "pie", "%", _init.translation.statistic.chartByDayTitle);
                },

                /**
                 * Draw Chart by the most listend tracks
                 * 
                 * @param {any} list
                 * @param {any} ctx
                 */
                drawChar_mostListend: function (list, ctx) {
                    var data = { labels: [], datasets: [] }, sum_val = [];
                    list.forEach(function (day, i) {
                        day.names.forEach(function (name, x) {
                            if ($.inArray(name, data.labels) === -1) {
                                data.labels.push(name);
                            }
                            if (!sum_val[x]) {
                                sum_val[x] = 0;
                            }
                            sum_val[x] += day.values[x];
                        });
                    })

                    data.datasets.push(getDefaultChartDataObj("", sum_val, getColorArray(sum_val.length)));
                    chart_bestTrack = drawChart(data, ctx, chart_bestTrack, true, "polarArea", "Users", _init.translation.statistic.chartMostListendTitle);

                },
            }
        };

        /**
          * Shows custom statistic view
          */
        $scope.showCustomView = function () {
            this.charts().destroyCharts();
            $scope.isCustom = true;
            $scope.updateChartData();
        }.bind(this);

        /**
          * Shows Fra kaare view
          */
        $scope.showFraKaareView = function () {
            this.charts().destroyCharts();
            $scope.isCustom = false;
            this.charts().drawFraaKaareData();
        }.bind(this)

        /**
          * Clears custom Charts
          */
        $scope.clearCharts = function () {
            this.charts().clearCharts();
        }.bind(this);

        /**
          * Update Custom Charts
          */
        $scope.updateChartData = function () {
            if ($scope.$$childTail.searchTerm && $scope.$$childTail.searchTerm.length > 1) {
                _statistic.getChartListCustom($scope.$$childTail.searchTerm).then(function (chartList) {
                    this.charts().drawCustomData(chartList);
                }.bind(this));
            }
        }.bind(this);

        $scope.showFraKaareView();

    }) // End Ctrl