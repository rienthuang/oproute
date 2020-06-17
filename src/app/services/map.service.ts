import { Injectable } from '@angular/core';

import { Map, Marker, Icon, Polyline, LatLngBounds } from "leaflet";
import { OneMapService } from './onemap.service';
import { PolylineUtilService } from './polyline-util.service';

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
  private routeGeometryArr: string[] = [];
  private polylineLayer: Polyline[] = [];
  private mapBounds = [];

  constructor(private oneMapService: OneMapService, private polylineUtilService: PolylineUtilService) { }

  initializeMap(map: Map) {
    this.map = map;
  }

  getMap(): Map {
    return this.map;
  }

  getMarkers(): Marker[] {
    return this.markersLayer;
  }

  getRouteGeometryArr(): string[] {
    return this.routeGeometryArr
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

  addPolyline(toLocationObj, index, existingLocations, modeOfTransport): void {
    if (index === 0) return;

    let fromLocationObj = existingLocations[index - 1];

    //Get Route Geometry through API Call to OneMap
    this.oneMapService.getRoute(fromLocationObj, toLocationObj, modeOfTransport)
      .subscribe((response) => {
        let routeGeometry = response['route_geometry'];
        let polyLineOptions = {
          color: 'red',
          weight: 3
        };

        let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, 5), polyLineOptions);
        this.polylineLayer.push(polyline);
        this.addMapBound(polyline.getBounds());

      })
  }

  addMapBound(bounds: LatLngBounds) {
    this.mapBounds.push(bounds);
    this.map.fitBounds(this.mapBounds);
  }

}



