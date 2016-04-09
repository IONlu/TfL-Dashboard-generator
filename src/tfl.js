angular.module('tfl', [])
.controller('departures', function( $scope, $http, $q ) {

    $scope.stations = [];

    $scope.search = function(){
        lookUpStation($scope.searchString).then( function(res) {
            $scope.stations = res;
        });
    };

    function lookUpStation(search) {
        return $http.get(
            'https://api.tfl.lu/stations/search/' + search
        ).then( function ( response ) {
            return response.data;
        });
    }

});
