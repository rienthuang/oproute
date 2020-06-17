import { Subject } from 'rxjs';
import { MapService } from './map.service';
import { LocationObj } from "src/app/models/location.model";

export class TspService {

  private locationsSelected: LocationObj[] = [];
  private MAX_LOCATIONS = 6;
  private modeOfTransport = 'drive'

  public locationsSelectedChanged = new Subject<LocationObj[]>();
  public locationDeleted = new Subject<number>();


  getLocationsSelected() {
    return this.locationsSelected.slice();
  }

  addLocation(location) {
    if (this.locationsSelected.length < this.MAX_LOCATIONS) this.locationsSelected.push(location);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
  }

  getLocationAt(index) {
    return this.locationsSelected[index];
  }

  replaceAt(location, index) {
    this.locationsSelected.splice(index, 1, location);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
  }

  deleteLocationAt(index) {
    this.locationsSelected.splice(index, 1);
    this.locationsSelectedChanged.next(this.locationsSelected.slice());
    this.locationDeleted.next(index);
  }

  getMaxLocations() {
    return this.MAX_LOCATIONS;
  }

  getModeOfTransport() {
    return this.modeOfTransport
  }

  setModeOfTransport(type: string) {
    this.modeOfTransport = type;

    //TODO: Recalculate Routing if any is already done
  }

}
