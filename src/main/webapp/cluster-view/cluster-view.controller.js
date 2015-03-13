'use strict';

angular.module('managementConsole')
    .controller('ClusterViewCtrl', [
    '$scope',
    '$stateParams',
    '$state',
    'modelController',
    function ($scope, $stateParams, $state, modelController) {
            if (!modelController.isAuthenticated()) {
                $state.go('/logout');
            }
            $scope.shared = {
                currentCollection: 'caches'
            };
            $scope.clusters = modelController.getServer().getClusters();
            $scope.currentCluster = modelController.getServer().getCluster($scope.clusters, $stateParams.clusterName);

            $scope.$watch('currentCluster', function (currentCluster) {
                if (currentCluster && currentCluster.name !== $stateParams.clusterName) {
                    $state.go('clusterView', {
                        'clusterName': currentCluster.name
                    });
                }
            });


            // we are showing this on view, fill it
            $scope.filteredCachesNames = [];


            // define sliders
            var sliders = [];
            sliders.push('average-read-time',
                         'average-write-time',
                         'average-remove-time',
                         'average-replication-time');

            for (var i = 0; i < sliders.length; i++) {
                var sliderElement = $("#slider-" + sliders[i]);
                sliderElement.noUiSlider({
                                             start: [0, 60000],
                                             snap: true,
                                             connect: true,
                                             range: {
                                                 'min': 0,
                                                 '5%': 1, '10%': 2, '15%': 3, '20%': 4, '25%': 5,
                                                 '30%': 10, '35%': 15, '40%': 20, '45%': 30,
                                                 '50%': 50, '55%': 100, '60%': 200, '65%': 500,
                                                 '70%': 1000, '75%': 2000, '80%': 5000, '85%': 10000,
                                                 '90%': 20000, '95%': 50000,
                                                 'max': 60000
                                             }
                                         });

                // e.g.: slider-avg-write-time-value-lower
                sliderElement.Link('lower').to($("#slider-" + sliders[i] + "-value-lower"));
                sliderElement.Link('upper').to($("#slider-" + sliders[i] + "-value-upper"));
                //sliderElement.on({
                //    set: function() {
                //        in case we want to re-filter caches while moving with sliders
                //    }
                //});
            }

            $scope.filterOutCaches = function() {
                // adjust shown caches according to current values in sliders
                $scope.filteredCachesNames = [];

                var cachesMap = $scope.currentCluster.caches;
                for (var k in cachesMap) {
                    if (cachesMap.hasOwnProperty(k)) {

                        $scope.filteredCachesNames.push(cachesMap[k].name);

                        // do checks
                        for (var i = 0; i < sliders.length; i++) {
                            var slid = $("#slider-" + sliders[i]);
                            var lowerValue = slid.val()[0];
                            var upperValue = slid.val()[1];
                            var statName = sliders[i];
                            checkCacheStatValue(statName, cachesMap[k], lowerValue, upperValue);
                        }
                    }
                }
            };

            var checkCacheStatValue = function(statName, cache, lowerValue, upperValue) {
                var p = modelController.getServer().fetchCacheStats($scope.currentCluster, cache);
                p.then(function (response) {
                    var statValue = response[0][statName];

                    if (lowerValue <= statValue && statValue <= upperValue) {
                        // criteria met, continue checking
                        cache.show = true;
                    } else {
                        cache.show = false;
                        var index = $scope.filteredCachesNames.indexOf(cache.name);
                        if (index > -1) {
                            // remove it
                            $scope.filteredCachesNames.splice(index, 1);
                        }
                    }
                });
            };
    }]);