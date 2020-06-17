import { Injectable, EventEmitter } from '@angular/core';

import { Map, Marker, Icon, Polyline } from "leaflet";

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: Map;

  flagIcon: Icon = new Icon({
    iconUrl: 'assets/img/flag2.png',
    iconSize: [45, 61],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  homeIcon: Icon = new Icon({
    iconUrl: 'assets/img/home2.png',
    shadowUrl: 'assets/img/marker-shadow.png',
    iconSize: [28, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  redIcon: Icon = new Icon({
    iconUrl: 'assets/img/marker-icon-2x-red.png',
    shadowUrl: 'assets/img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  private markersLayer: Marker[] = [];
  private polylineLayer: Polyline[] = [];



  initializeMap(map: Map) {
    this.map = map;
  }

  getMap(): Map {
    return this.map;
  }

  getMarkers(): Marker[] {
    return this.markersLayer;
  }

  getPolylineLayer(): Polyline[] {
    return this.polylineLayer;
  }

  addMarker(locationObj, index): void {
    let latitude = locationObj['LATITUDE'];
    let longitude = locationObj['LONGITUDE'];

    let icon;

    index === 0 ? icon = this.homeIcon : icon = this.redIcon

    let marker = new Marker([latitude, longitude], { icon: icon });
    this.markersLayer.push(marker);
  }

  replaceMarkerAt(locationObj, index): void {
    let latitude = locationObj['LATITUDE'];
    let longitude = locationObj['LONGITUDE'];

    let icon;

    index === 0 ? icon = this.homeIcon : icon = this.redIcon

    let marker = new Marker([latitude, longitude], { icon: icon });
    this.markersLayer.splice(index, 1, marker);
  }

}
