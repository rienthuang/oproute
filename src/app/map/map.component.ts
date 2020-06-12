import { Component, OnInit, ViewChild } from '@angular/core';


import * as L from "leaflet";
import { MapService } from '../services/map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: L.Map;
  options: Object;

  zoomOptions = L.control.zoom({
    position: 'bottomright'
  })

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    const mapBoundary = new L.LatLngBounds(new L.LatLng(1.1428, 103.585), new L.LatLng(1.488, 104.15));
    const defaultTile = L.tileLayer('https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 11,
      attribution: 'Map data &copy contributors, <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a> &nbsp;&#124;&nbsp; <a href="https://tech.gov.sg/report_vulnerability" target="_blank">Report Vulnerability</a>',
    })

    this.options = {
      center: [1.3579378, 103.8777261],
      maxZoom: 19,
      minZoom: 12,
      zoom: 12,
      zoomControl: false,
      layers: [defaultTile],
      maxBounds: mapBoundary
    };
  }

  onMapReady(map: L.Map) {

    this.map = map;
    this.mapService.initializeMap(this.map);

    //Set zoom controls to bottom right of the map
    L.control.zoom({ position: 'bottomright' }).addTo(map);
  }
}
