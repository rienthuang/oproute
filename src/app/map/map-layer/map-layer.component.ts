import { Component, OnInit } from '@angular/core';

import { tileLayer } from "leaflet";
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.css']
})
export class MapLayerComponent implements OnInit {


  showLandLayer = false;
  landTile = tileLayer('https://maps-{s}.onemap.sg/v3/Original/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 11,
    attribution: 'Map data &copy contributors, <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a> &nbsp;&#124;&nbsp; <a href="https://tech.gov.sg/report_vulnerability" target="_blank">Report Vulnerability</a>',
  });

  showNightLayer = false;
  nightTile = tileLayer('https://maps-{s}.onemap.sg/v3/Night/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 11,
    attribution: 'Map data &copy contributors, <a href="https://www.sla.gov.sg/" target="_blank" rel="noopener noreferrer">Singapore Land Authority</a> &nbsp;&#124;&nbsp; <a href="https://tech.gov.sg/report_vulnerability" target="_blank">Report Vulnerability</a>',
  });

  markersLayer = [];
  polylineLayer = [];

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.markersLayer = this.mapService.getMarkers();
    this.polylineLayer = this.mapService.getPolylineLayer();
  }

}
