import { Subject } from 'rxjs';
import { MapService } from './map.service';
import { LocationObj } from "src/app/models/location.model";
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TspService {

  private locationsSelected: LocationObj[] = [];
  private optimizedLocations: LocationObj[] = [];
  private MAX_LOCATIONS = 6;
  private modeOfTransport = 'drive'

  public locationsSelectedChanged = new Subject<LocationObj[]>();
  public locationDeleted = new Subject<number>();

  getLocationsSelected(): LocationObj[] {
    return this.locationsSelected.slice();
  }

  setLocationsSelected(newLocationsSelected: LocationObj[]): void {
    this.locationsSelected = newLocationsSelected.slice();
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
  }

  addLocation(location): void {
    if (this.locationsSelected.length < this.MAX_LOCATIONS) this.locationsSelected.push(location);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
  }

  getLocationAt(index): LocationObj {
    return this.locationsSelected[index];
  }

  replaceAt(location, index): void {
    this.locationsSelected.splice(index, 1, location);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
  }

  deleteLocationAt(index): void {
    this.locationsSelected.splice(index, 1);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
    this.locationDeleted.next(index);
  }

  getMaxLocations(): number {
    return this.MAX_LOCATIONS;
  }

  getModeOfTransport(): string {
    return this.modeOfTransport
  }

  setModeOfTransport(type: string): void {
    this.modeOfTransport = type;
  }

  getOptimizedLocations(): LocationObj[] {
    return this.optimizedLocations.slice();
  }

  setOptimizedLocations(locations: LocationObj[]): void {
    this.optimizedLocations = locations.slice();
  }

}
