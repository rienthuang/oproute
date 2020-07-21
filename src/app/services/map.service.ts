import { Injectable } from '@angular/core';

import { Map, Marker, Icon, Polyline, LatLngBounds } from "leaflet";
import { OneMapService } from './onemap.service';
import { PolylineUtilService } from './polyline-util.service';
import { Subject, Observable } from 'rxjs';
import { LocationObj } from '../models/location.model';
import { SpinnerService } from './spinner.service';
import { TspService } from './tsp.service';

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: Map;

  numberedIconsUrl = 'assets/img/numbered_markers/'

  flagIcon: Icon = new Icon({
    iconUrl: 'assets/img/flag.png',
    iconSize: [25, 41],
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

  private ENCODER_PRECISION = 5;

  private markersLayer: Marker[] = [];
  private polylineLayer: Polyline[] = [];
  private mapBounds = [];

  private optimizedMarkersLayer: Marker[] = [];
  private optimizedPolylineLayer: Polyline[] = [];
  private optimizedMapBounds = [];

  public markersChanged = new Subject<Marker[]>();
  public polylineChanged = new Subject<Polyline[]>();

  public optimizedLayerBuilt = new Subject<{ polylines: Polyline[], markers: Marker[] }>();

  constructor(
    private oneMapService: OneMapService,
    private polylineUtilService: PolylineUtilService,
    private spinnerService: SpinnerService,
    private tspService: TspService
  ) { }

  initializeMap(map: Map) {
    this.map = map;
  }

  getMap(): Map {
    return this.map;
  }

  getMarkers(): Marker[] {
    return this.markersLayer.slice();
  }

  getPolylineLayer(): Polyline[] {
    return this.polylineLayer.slice();
  }

  addNewLocationToMap(location: LocationObj, index: number, existingLocations: LocationObj[], modeOfTransport: string): void {

    this.spinnerService.mapIsChanging.next(true);

    //Add Marker
    this.addMarker(location, index, 'default');

    //Add Polyline if it's not the only location
    if (index === 0) {
      this.spinnerService.mapIsChanging.next(false);
      return;
    }
    this.oneMapService.getGeometryRoute(existingLocations[index - 1], existingLocations[index], modeOfTransport)
      .subscribe((routeGeometry: string) => {
        this.addPolyline('red', 3, routeGeometry, 'default', true);
        this.spinnerService.mapIsChanging.next(false);
      })
  }

  replaceLocationOnMap(newLocation: LocationObj, index: number, existingLocations: LocationObj[], modeOfTransport: string): void {

    this.spinnerService.mapIsChanging.next(true);

    //Replace Marker
    this.replaceMarkerAt(newLocation, index);


    //Replace polyline
    if (index === 0 && existingLocations.length === 1) return; //only location so far, no polyline to draw

    let newStartLocation = index === 0;
    let newLastLocation = index === existingLocations.length - 1;
    let newMiddleLocation = (!newStartLocation && !newLastLocation);

    let fromLocation;
    let toLocation;

    if (newStartLocation) {
      fromLocation = newLocation;
      toLocation = existingLocations[1]

      this.oneMapService.getGeometryRoute(fromLocation, toLocation, modeOfTransport)
        .subscribe((routeGeometry: string) => {
          this.replacePolylineAt(routeGeometry, index, 'red', 3, true);
          this.spinnerService.mapIsChanging.next(false);
        })

    } else if (newLastLocation) {
      fromLocation = existingLocations[index - 1];
      toLocation = newLocation;

      this.oneMapService.getGeometryRoute(fromLocation, toLocation, modeOfTransport)
        .subscribe((routeGeometry: string) => {
          this.replacePolylineAt(routeGeometry, index - 1, 'red', 3, true);
          this.spinnerService.mapIsChanging.next(false);
        })

    } else {
      fromLocation = existingLocations[index - 1];
      toLocation = existingLocations[index + 1];

      //Perform 2 API calls to OneMap asynchronously
      //From -> Middle
      this.oneMapService.getGeometryRoute(fromLocation, newLocation, modeOfTransport)
        .subscribe((routeGeometry: string) => {
          this.replacePolylineAt(routeGeometry, index - 1, 'red', 3, false);
        })

      //Middle -> To
      this.oneMapService.getGeometryRoute(newLocation, toLocation, modeOfTransport)
        .subscribe((routeGeometry: string) => {
          this.replacePolylineAt(routeGeometry, index, 'red', 3, true);
          this.spinnerService.mapIsChanging.next(false);
        })

    }

  }

  addMarker(locationObj: LocationObj, index: number, layer: string): void {
    let latitude = locationObj['LATITUDE'];
    let longitude = locationObj['LONGITUDE'];

    let icon;

    index === 0 ? icon = this.homeIcon : icon = this.redIcon

    let marker = new Marker([+latitude, +longitude], { icon: icon });
    if (layer === 'default') {
      this.markersLayer.push(marker);
      if (index === 0) this.focusOnMarker(marker);
      this.markersChanged.next(this.markersLayer.slice());
    } else if (layer === 'optimized') {
      this.optimizedMarkersLayer.push(marker);
    }
  }

  addNumberedMarkers(locations: LocationObj[], layer: string): void {
    let isAtoZ = this.tspService.getIsAtoZ();
    for (let i = 0; i < locations.length; i++) {
      let latitude = locations[i]['LATITUDE'];
      let longitude = locations[i]['LONGITUDE'];
      let icon;

      if (i === locations.length - 1 && !isAtoZ) continue;

      if (i === 0) {
        icon = this.homeIcon;
      } else if (i === locations.length - 1 && isAtoZ) {
        icon = this.flagIcon;
      } else {
        icon = new Icon({
          iconUrl: this.numberedIconsUrl + 'marker' + (i + 1) + '.png',
          shadowUrl: 'assets/img/marker-shadow.png',
          iconSize: [28, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
      }

      let marker = new Marker([+latitude, +longitude], { icon: icon });
      if (layer === 'optimized') this.optimizedMarkersLayer.push(marker);

    }
  }

  replaceMarkerAt(locationObj, index): void {
    let latitude = locationObj['LATITUDE'];
    let longitude = locationObj['LONGITUDE'];

    let icon;

    index === 0 ? icon = this.homeIcon : icon = this.redIcon

    let marker = new Marker([latitude, longitude], { icon: icon });
    this.markersLayer.splice(index, 1, marker);

    if (index === 0 && this.markersLayer.length === 1) this.focusOnMarker(marker);

    this.markersChanged.next(this.markersLayer.slice());
  }

  deleteMarkerAt(index): void {
    this.markersLayer.splice(index, 1);
    this.markersChanged.next(this.markersLayer.slice());
  }

  focusOnMarker(marker: Marker) {
    let markerBounds = new LatLngBounds(marker.getLatLng(), marker.getLatLng());
    this.map.fitBounds(markerBounds, { maxZoom: 14 });
  }

  addPolyline(polylineColor: string, weight: number, routeGeometry: string, layer: string, fitToMap: boolean) {
    let polylineOptions = {
      color: polylineColor,
      weight: weight
    }
    let polyline = new Polyline(this.polylineUtilService.decode(routeGeometry, this.ENCODER_PRECISION), polylineOptions);

    if (layer === 'default') {
      this.polylineLayer.push(polyline);
      this.addMapBounds(polyline.getBounds(), layer, fitToMap);
      this.polylineChanged.next(this.polylineLayer);
    } else if (layer === 'optimized') {
      this.optimizedPolylineLayer.push(polyline);
      this.addMapBounds(polyline.getBounds(), layer, fitToMap);
    }
  }

  replacePolylineAt(newRouteGeometry, indexToReplace, polylineColor: string, weight: number, fitBounds: boolean) {
    let polylineOptions = {
      color: polylineColor,
      weight: weight
    }
    let newPolyline = new Polyline(this.polylineUtilService.decode(newRouteGeometry, this.ENCODER_PRECISION), polylineOptions);
    this.polylineLayer.splice(indexToReplace, 1, newPolyline);
    this.polylineChanged.next(this.polylineLayer)

    this.replaceMapBounds(indexToReplace, newPolyline.getBounds(), fitBounds);
  }

  fullReplacePolyline(geometryRoutes: string[], polylineColor: string, weight: number) {
    this.polylineLayer = [];
    this.mapBounds = [];
    for (let i = 0; i < geometryRoutes.length; i++) {
      let fitToMap = i === geometryRoutes.length - 1;
      this.addPolyline(polylineColor, weight, geometryRoutes[i], 'default', fitToMap);
    }
  }

  deletePolylineAt(index, updatedLocations, modeOfTransport, polylineOptions): void {

    this.spinnerService.mapIsChanging.next(true);

    let lastLocation = index === updatedLocations.length;

    if (lastLocation) {
      this.polylineLayer.splice(index - 1, 1);

      if (updatedLocations.length === 1) {
        this.deleteMapBoundsAt(index - 1, false);
        this.focusOnMarker(this.getMarkers()[0]);
      } else {
        this.deleteMapBoundsAt(index - 1, true);
      }

      this.polylineChanged.next(this.polylineLayer);
      this.spinnerService.mapIsChanging.next(false);

    } else {
      //Middle location. It's always going to have a before and after index since the app doesn't allow users to delete Home Base
      //Get the new direct route polyline layer and replace existing ones
      let fromLocationObj = updatedLocations[index - 1];
      let toLocationObj = updatedLocations[index];

      this.oneMapService.getGeometryRoute(fromLocationObj, toLocationObj, modeOfTransport)
        .subscribe((routeGeometry: string) => {
          this.replacePolylineAt(routeGeometry, index, 'red', 3, false);
          this.polylineLayer.splice(index - 1, 1);
          this.deleteMapBoundsAt(index - 1, true);
          this.polylineChanged.next(this.polylineLayer);
          this.spinnerService.mapIsChanging.next(false);
        })
    }
  }

  addMapBounds(bounds: LatLngBounds, layer: string, fit: boolean) {
    if (layer === 'default') {
      this.mapBounds.push(bounds);
      if (fit) this.map.fitBounds(this.mapBounds);
    } else if (layer === 'optimized') {
      this.optimizedMapBounds.push(bounds);
      if (fit) this.map.fitBounds(this.optimizedMapBounds);
    }
  }

  replaceMapBounds(index: number, bounds: LatLngBounds, fitBounds: boolean) {
    this.mapBounds.splice(index, 1, bounds);
    if (fitBounds) this.map.fitBounds(this.mapBounds);
  }

  deleteMapBoundsAt(index: number, fitBounds: boolean) {
    this.mapBounds.splice(index, 1);
    if (fitBounds) this.map.fitBounds(this.mapBounds);
  }

  recalculateRoute(locations: LocationObj[], modeOfTransport) {
    this.spinnerService.mapIsChanging.next(true);
    let geometryRoutes: Observable<string[]> = this.oneMapService.getGeometryRoutes(locations, modeOfTransport);
    geometryRoutes.subscribe((routeGeometryArr: string[]) => {
      //Full replace of Polyline layer
      this.fullReplacePolyline(routeGeometryArr, 'red', 3);

      //Map View Change
      this.polylineChanged.next(this.polylineLayer);
      this.spinnerService.mapIsChanging.next(false);
    });
  }

  resetAndBuildOptimizedMap(orderedLocations: LocationObj[], modeOfTransport) {
    this.spinnerService.mapIsChanging.next(true);

    this.optimizedMarkersLayer = [];
    this.optimizedPolylineLayer = [];
    this.optimizedMapBounds = [];

    //Add Markers
    this.addNumberedMarkers(orderedLocations, 'optimized')

    //Build polylines
    let geometryRoutes: Observable<string[]> = this.oneMapService.getGeometryRoutes(orderedLocations, modeOfTransport);
    geometryRoutes.subscribe((routeGeometryArr: string[]) => {

      for (let i = 0; i < routeGeometryArr.length; i++) {
        let fitToMap = i === routeGeometryArr.length - 1;
        this.addPolyline('#08a800', 4, routeGeometryArr[i], 'optimized', fitToMap)
      }

      //Emit
      this.optimizedLayerBuilt.next({ polylines: this.optimizedPolylineLayer, markers: this.optimizedMarkersLayer })
      this.spinnerService.mapIsChanging.next(false);
    });
  }
}



