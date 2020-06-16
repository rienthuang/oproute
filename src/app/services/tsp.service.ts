import { EventEmitter } from '@angular/core';

export class TspService {

  private locationsSelected = [{}];

  getLocationsSelected() {
    return this.locationsSelected;
  }

  addLocation(location) {
    this.locationsSelected.push(location);

  }

  getLocationAt(index) {
    return this.locationsSelected[index];
  }

  replaceAt(location, index) {
    this.locationsSelected.splice(index, 1, location);
  }

}
