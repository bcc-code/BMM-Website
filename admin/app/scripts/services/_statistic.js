'use strict';

angular.module('bmmLibApp')
    .factory('_statistic', ['$q', '_api', function ($q, _api) {

        var _stats = [];

        /**
         * Gets jQuery XHR Request Object by filename 
         * 
         * @param {any} filename
         * @returns Request Object
         */
        function getStatRequest(filename) {
            return {
                type: 'GET',
                url: 'https://bmm-statistics.brunstad.org/' + filename,
                contentType: 'application/json'
            }
        }

        /**
         * Get Json File name by timestamp
         *
         * @param {string} timestamp
         * @returns Json Filename e.g. 2016-05-12.json
         */
        function getFileNameByDate(timestamp) {
            var date = new Date(timestamp);
            var month = date.getMonth() + 1;
            var day = date.getDate().toString();

            if (month.toString().length === 1) {
                month = "0" + month;
            }

            if (day.length === 1){
                 day = "0" + day;
            }

            return date.getFullYear() + "-" + month + "-" + day + ".json";
        }

        /**
         * Sorts statistics by date
         * 
         * @param {any} stats
         * @returns sorted array of stats
         */
        function sortStatsByDate(stats) {
            stats.sort(function (a, b) {
                var d1 = new Date(a.name), d2 = new Date(b.name);
                return ((d1 < d2) ? -1 : ((d1 === d2) ? 0 : 1));
            });

            return stats;
        }

        /**
         * Sort Fra Kåre list by order value
         * 
         * @param {Array of TrackItems} kaareList
         * @returns {Array of TrackItems} sorted List
         */
        function sortList(kaareList) {
            var list = [];
            for (var x in kaareList.names)
                list.push({ 'name': kaareList.names[x], 'order': kaareList.orders[x], 'value': kaareList.values[x], 'key': kaareList.keys[x] });

            list.sort(function (a, b) {
                return ((a.order < b.order) ? -1 : ((a.name == b.name) ? 0 : 1));
            });

            for (var k = 0; k < list.length; k++) {
                kaareList.names[k] = list[k].name;
                kaareList.orders[k] = list[k].order;
                kaareList.values[k] = list[k].value;
                kaareList.keys[k] = list[k].key;
            }

            return kaareList;
        }

        /**
         * Builds Data List by Tracklist (from BMM-API) and StatsList (daily Json export)
         * 
         * @param {promise} d1 (trackList)
         * @param {promise} d2 (Statistics)
         * @returns promise => mapped/sorted chartList
         */
        function buildDataList(d1, d2) {
            var deferred = $.Deferred();
            $.when(d1, d2).done(function (trackList, stats) {
                stats = sortStatsByDate(stats);
                var stats_tmp = stats, chartList = [];
                stats.forEach(function (stat, day_index) {
                    var singleTrack = trackList[0].title !== undefined;
                    chartList[day_index] = []
                    chartList[day_index].values = [];
                    chartList[day_index].names = [];
                    chartList[day_index].keys = [];
                    chartList[day_index].orders = [];
                    chartList[day_index].date = new Date(stat.name);

                    stat.rows.forEach(function (item, i) {
                        var key = item.key[0], index = -1;
                        if (key.indexOf("track") === -1) {
                            return;
                        }

                        if (!singleTrack) {
                            for (var n = 0; n < trackList[0].length; n++) {
                                index = -1;
                                if (trackList[0][n].type + "_" + trackList[0][n].id == key) {
                                    index = n;
                                    break;
                                }
                            }
                        } else {
                            if (trackList[0].type + "_" + trackList[0].id == key)
                                index = 0;
                        }

                        if (index !== -1) {
                            chartList[day_index].keys.push(key);
                            chartList[day_index].names.push(singleTrack ? trackList[0].title : trackList[0][index].title);
                            chartList[day_index].orders.push(singleTrack ? trackList[0].order : trackList[0][index].order);
                            if (day_index === 0) {
                                chartList[day_index].values.push(item.value);
                            } else {
                                var tmpVal = 0, tmpItem;
                                stats_tmp[day_index - 1].rows.forEach(function (el, ind) {
                                    if (el.key[0] === key) {
                                        tmpItem = stats_tmp[day_index - 1].rows[ind];
                                    }
                                });

                                if (tmpItem && tmpItem.value > 0) {
                                    tmpVal = tmpItem.value;
                                };

                                chartList[day_index].values.push(item.value - tmpVal);
                            }
                        }
                    })
                    sortList(chartList[day_index]);
                })

                deferred.resolve(chartList);
            });
            return deferred.promise();
        }

        /**
         * Gets Statistics from last {scope} days
         * @returns promise => Statistic Objects
         */
        function getStats() {
            var scope = 10
                , stats = []
                , today = new Date()
                , deferred = $.Deferred()
                , queue = [];

            if (_stats.length === 0) {
                for (var i = 0; i <= scope; i++) {
                    var filename = getFileNameByDate(new Date().setDate(today.getDate() - i));
                    queue.push($.ajax(getStatRequest(filename)).always(function (stat, arg) {
                        if (stat && arg === "success") {
                            stat.name = this.name.replace(".json", "");
                            stats.push(stat);
                        }
                    }.bind({ name: filename, index: i })));
                }
                $.when.apply(queue).done(function() {
                    _stats = stats;
                    deferred.resolve(stats);
                });
            } else {
                deferred.resolve(_stats);
            }

            return deferred.promise();
        }

        function getChartListFraKaare() {
            var d1 = _api.trackGet("", { tags: ['fra-kaare'] }, ["no"])
                , d2 = getStats();

            return buildDataList(d1, d2);
        }

        function getChartListCustom(id) {
            var d1
                , d2 = getStats()
                , params

            //By ShareLink
            if (id.indexOf("http") >= 0) {
                params = id.split("/", 7);
                id = params[4];
            }

            //By Track Id
            if (!isNaN(parseFloat(id))) {
                d1 = _api.trackGet(id);
            }

            //By Search
            if (id.length <= 0) id = 1;
            {
                d1 = _api.search(id);
            }

            return buildDataList(d1, d2);
        }

        //Factory Definition Object
        return {
            getChartListFraKaare: getChartListFraKaare,
            getChartListCustom: getChartListCustom
        }
    }]);