import { EventEmitter } from '@angular/core';

export class TspService {

  private locationsSelected = [];
  private MAX_LOCATIONS = 4;

  getLocationsSelected() {
    return this.locationsSelected;
  }

  addLocation(location) {
    if (this.locationsSelected.length < this.MAX_LOCATIONS) this.locationsSelected.push(location);
  }

  getLocationAt(index) {
    return this.locationsSelected[index];
  }

  replaceAt(location, index) {
    this.locationsSelected.splice(index, 1, location);
  }

  getMaxLocations() {
    return this.MAX_LOCATIONS;
  }

}
