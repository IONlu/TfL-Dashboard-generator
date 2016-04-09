angular.module('tfl', [])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})
.controller('departures', function( $scope, $http, $q ) {

    var tflSocket = io.sails.connect('https://api.tfl.lu');
    io.sails.useCORSRouteToGetCookie = false;

    $scope.stations = [];

    var departuresObject = {};

    $scope.deps = [];

    $scope.search = function(){
        lookUpStation($scope.searchString).then( function(res) {
            res = res.slice(0,10);
            $scope.stations = res;
        });
    };

    $scope.selectStation = function(stationId){
        selectStation(stationId);
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

    tflSocket.on('update', function gotUpdate (data) {
        angular.forEach(data, function(value, key) {

            switch (value.event) {
                case 'new':
                    departuresObject[key] = value;
                    break;
                case 'update':
                    departuresObject[key] = value;
                    break;
                case 'delete':
                    delete departuresObject[key];
                    break;
            }

            var newDepartures = [];

            for (var departure in departuresObject) {
                if (departuresObject.hasOwnProperty(key)) {
                    newDepartures.push(departuresObject[departure]);
                }
            }

            $scope.deps = newDepartures;
        });
    });

    function selectStation(stationId){

        tflSocket.get('/departures/live/' + stationId, function gotResponse(body, response) {
            console.log(response, body);
        });

    }

});
