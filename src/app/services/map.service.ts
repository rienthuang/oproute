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

    if (index === 0) this.focusOnMarker(marker);
  }

  replaceMarkerAt(locationObj, index): void {
    let latitude = locationObj['LATITUDE'];
    let longitude = locationObj['LONGITUDE'];

    let icon;

    index === 0 ? icon = this.homeIcon : icon = this.redIcon

    let marker = new Marker([latitude, longitude], { icon: icon });
    this.markersLayer.splice(index, 1, marker);

    if (index === 0) this.focusOnMarker(marker);

  }

  focusOnMarker(marker: Marker) {
    let markerBounds = new LatLngBounds(marker.getLatLng(), marker.getLatLng());
    this.map.fitBounds(markerBounds, { maxZoom: 14 });
  }

  addPolyline(toLocationObj, index, existingLocations, modeOfTransport, polylineOptions): void {
    if (index === 0) return;

    let fromLocationObj = existingLocations[index - 1];

    //Get Route Geometry through API Call to OneMap
    this.oneMapService.getRoute(fromLocationObj, toLocationObj, modeOfTransport)
      .subscribe((response) => {
        let routeGeometry = response['route_geometry'];

        let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, 5), polylineOptions);
        this.polylineLayer.push(polyline);
        this.addMapBounds(polyline.getBounds());

      })
  }

  replacePolylineAt(locationObj, index, existingLocations, modeOfTransport, polylineOptions): void {

    //only location so far, no polyline to draw
    if (index === 0 && existingLocations.length === 1) return;

    let fromLocationObj;
    let toLocationObj;

    let startLocation = false;
    let middleLocation = false;
    let lastLocation = false;

    if (index === 0) {
      //first location
      startLocation = true;
      fromLocationObj = locationObj;
      toLocationObj = existingLocations[1];

    } else if (index === existingLocations.length - 1) {
      //last location
      lastLocation = true;
      toLocationObj = locationObj;
      fromLocationObj = existingLocations[index - 1];

    } else {
      //location in the middle
      middleLocation = true;
      fromLocationObj = existingLocations[index - 1];
      toLocationObj = existingLocations[index + 1];
    }

    if (!middleLocation) {
      this.oneMapService.getRoute(fromLocationObj, toLocationObj, modeOfTransport)
        .subscribe((response) => {
          let routeGeometry = response['route_geometry'];
          let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, 5), polylineOptions);

          if (startLocation) {
            this.polylineLayer.splice(index, 1, polyline);
            this.replaceMapBounds(index, polyline.getBounds(), true);
          } else {
            this.polylineLayer.splice(index - 1, 1, polyline);
            this.replaceMapBounds(index - 1, polyline.getBounds(), true);
          }
        })
    } else {
      //Perform 2 API call to OneMap asynchronously
      this.oneMapService.getRoute(fromLocationObj, locationObj, modeOfTransport)
        .subscribe((response) => {
          let routeGeometry = response['route_geometry'];
          let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, 5), polylineOptions);
          this.polylineLayer.splice(index - 1, 1, polyline);
          this.replaceMapBounds(index - 1, polyline.getBounds(), false);
        });

      this.oneMapService.getRoute(locationObj, toLocationObj, modeOfTransport)
        .subscribe((response) => {
          let routeGeometry = response['route_geometry'];
          let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, 5), polylineOptions);
          this.polylineLayer.splice(index, 1, polyline);
          this.replaceMapBounds(index, polyline.getBounds(), true);
        })
    }

  }

  addMapBounds(bounds: LatLngBounds) {
    this.mapBounds.push(bounds);
    this.map.fitBounds(this.mapBounds);
  }

  replaceMapBounds(index: number, bounds: LatLngBounds, fitBounds: boolean) {
    this.mapBounds.splice(index, 1, bounds);
    if (fitBounds) this.map.fitBounds(this.mapBounds);
  }

}



