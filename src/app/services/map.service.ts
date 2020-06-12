import { Injectable, EventEmitter } from '@angular/core';

import { Map } from "leaflet";

@Injectable({ providedIn: 'root' })
export class MapService {
  private map: Map;

  initializeMap(map: Map) {
    this.map = map;
  }

  getMap() {
    return this.map;
  }

}
