angular.module('tfl', [])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})
.controller('departures', function( $scope, $http, $q ) {

    $scope.stations = [];

    $scope.search = function(){
        lookUpStation($scope.searchString).then( function(res) {
            res = res.slice(0,10);
            $scope.stations = res;
        });
    };

    $scope.selectStation = function(stationId){
        selectStation(stationId).then( function(res) {
            $scope.departures = JSON.stringify(res);
        });
    }

    function selectStation(stationId){
        return $http.get(
            'https://api.tfl.lu/departures/' + stationId
        ).then( function ( response ) {
            return response.data;
        });
    }

    function lookUpStation(search) {

        if (search == '') {
            search = 'Luxembourg, Gare Centrale';
        }

        return $http.get(
            'https://api.tfl.lu/stations/search/' + search
        ).then( function ( response ) {
            return response.data;
        });
    }

});
