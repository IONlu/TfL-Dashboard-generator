export class App {
    search = 'Lux';
    station = null;

    change(e) {
        this.station = e.detail.station;
    }
}
