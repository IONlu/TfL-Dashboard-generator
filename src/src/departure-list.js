import {inject, bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';
import io from 'socket.io-client';

@inject(HttpClient)
export class DepartureList {
    @bindable station = null;

    constructor(http) {
        this.http = http;
        this.departures = [];
        this.socket = io('https://api.tfl.lu');
        this.socket.on('connect', (e) => {console.log('connect', e)});
        this.socket.on('disconnect', (e) => {console.log('disconnect', e)});
    }

    loadDepartures() {
        if (!this.station) {
            this.station = [];
        }
        return this.http.fetch('https://api.tfl.lu/departures/' + this.station)
            .then((response) => response.json())
            .then((departures) => {
                this.departures = departures;
            });
    }

    bind() {
        return this.loadDepartures();
    }

    stationChanged() {
        this.loadDepartures();
        this.socket.emit('get', {url: '/departures/live/' + this.station}, (e) => {console.log('departures', e)});
    }
}
