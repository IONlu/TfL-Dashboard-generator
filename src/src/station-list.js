import {inject, bindable} from 'aurelia-framework';
import {HttpClient} from 'aurelia-fetch-client';

@inject(Element, HttpClient)
export class StationList {
    @bindable search = null;

    constructor(element, http) {
        this.element = element;
        this.http = http;
        this.stations = [];
    }

    loadStations() {
        return this.http.fetch('https://api.tfl.lu/stations/search/' + this.search)
            .then((response) => response.json())
            .then((stations) => {
                this.stations = stations;
            });
    }

    bind() {
        return this.loadStations();
    }

    searchChanged() {
        this.loadStations();
    }

    select(station) {
        var event = new CustomEvent('change', {
            detail: {
                station: station
            },
            bubbles: true
        });
        this.element.dispatchEvent(event);
    }
}
