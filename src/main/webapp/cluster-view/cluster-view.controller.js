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

        $("#slider").noUiSlider({
            start: [0, 100],
            connect: true,
            range: {
                'min': 0,
                'max': 100
            }
        });

        $scope.sliderValueLeft = $("#slider").val()[0];
        $scope.sliderValueRight = $("#slider").val()[1];


  }]);