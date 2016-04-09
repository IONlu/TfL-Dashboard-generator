angular.module('tfl', [])
.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
})
.controller('departures', function( $scope, $http, $q ) {

    io.sails.url = 'https://api.tfl.lu';
    io.sails.useCORSRouteToGetCookie = false;

    $scope.stations = [];

    var departuresObject = {};

    $scope.dep = ['test','daniel','thierry'];

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

    function selectStation(stationId){

        io.socket.on('update', function gotUpdate (data) {
            angular.forEach(data, function(value, key) {

                console.log(value.event);

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

                console.log(value);

                /*var newDepartures = [];

                for (var departure in departuresObject) {
                    if (departuresObject.hasOwnProperty(key)) {
                        newDepartures.push(departuresObject[departure]);
                    }
                }

                $scope.departuresList = newDepartures;

                console.log($scope.departuresList);*/

                $scope.dep.push(value.destination);

            });
        });

        io.socket.get('/departures/live/' + stationId, function gotResponse(body, response) {
            console.log('Server responded with status code ' + response.statusCode + ' and data: ', body);
        });

    }

});
