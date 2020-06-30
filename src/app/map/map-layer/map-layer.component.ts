import { Component, OnInit, OnDestroy } from '@angular/core';

import { tileLayer, Marker, Polyline } from "leaflet";
import { MapService } from 'src/app/services/map.service';
import { Subscription } from 'rxjs';
import { ControlPanelService } from 'src/app/services/control-panel.service';

@Component({
  selector: 'app-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.css']
})
export class MapLayerComponent implements OnInit, OnDestroy {

  activeTab = 'home';

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

  markersLayer: Marker[] = [];
  polylineLayer: Polyline[] = [];

  optimizedMakerLayer: Marker[] = [];
  optimizedPolylineLayer: Polyline[] = [];

  markersChangedSubscription: Subscription;
  polylineChangedSubscription: Subscription;
  tabSubscription: Subscription;

  constructor(private mapService: MapService, private controlPanelService: ControlPanelService) { }

  ngOnInit(): void {
    this.markersLayer = this.mapService.getMarkers();
    this.polylineLayer = this.mapService.getPolylineLayer();

    this.tabSubscription = this.controlPanelService.tabChanged.subscribe(newActiveTab => {
      this.activeTab = newActiveTab;
    })

    this.markersChangedSubscription = this.mapService.markersChanged.subscribe((updatedMarkers: Marker[]) => {
      this.markersLayer = updatedMarkers;
    });

    this.polylineChangedSubscription = this.mapService.polylineChanged.subscribe((updatedPolyline: Polyline[]) => {
      this.polylineLayer = updatedPolyline;
    })

    this.mapService.optimizedLayerBuilt.subscribe(optimizedLayer => {
      this.optimizedPolylineLayer = optimizedLayer.polylines;
      this.optimizedMakerLayer = optimizedLayer.markers;
    })


  }

  ngOnDestroy(): void {
    this.markersChangedSubscription.unsubscribe();
    this.polylineChangedSubscription.unsubscribe();
  }

}
