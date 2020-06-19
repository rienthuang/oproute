import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { OneMapService } from 'src/app/services/onemap.service';
import { FormControl } from '@angular/forms';
import { TspService } from 'src/app/services/tsp.service';
import { MapService } from 'src/app/services/map.service';
import { LocationObj } from 'src/app/models/location.model';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocationSearchComponent implements OnInit {

  searchFormControl = new FormControl();

  options = [];
  locationSelected: LocationObj;
  optionSelected = false;

  @Input('location_index') index;
  @ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger;

  locationDeletedSubscription: Subscription;

  constructor(
    private oneMapService: OneMapService,
    private tspService: TspService,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    console.log('location search component init. index = ' + this.index);

    let locationExist = this.tspService.getLocationAt(this.index);
    if (locationExist) {
      this.locationSelected = locationExist;
      this.searchFormControl.setValue(locationExist);
      this.optionSelected = true;
    }

    this.locationDeletedSubscription = this.tspService.locationDeleted.subscribe((deletedIndex) => {
      if (deletedIndex === this.index) {
        this.locationSelected = this.tspService.getLocationAt(this.index);
        this.searchFormControl.setValue(this.locationSelected)
      }
    })
  }

  ngOnDestroy(): void {
    console.log('search component index ' + this.index + ' destroyed');
    this.locationDeletedSubscription.unsubscribe();
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.length > 1) {
      this.oneMapService.getAutocompleteSearch(searchValue)
        .subscribe((response) => {
          this.options = response['results'];
        })
    }
  }

  displayFn(locationObj: LocationObj) {
    if (locationObj) {

      let buildingName = locationObj['BUILDING'];
      let address = locationObj['ADDRESS'];

      return buildingName !== 'NIL'
        ? buildingName
        : address
    }
  }

  displayString(locationObj: LocationObj): string {
    let buildingName = locationObj['BUILDING'];
    let address = locationObj['ADDRESS'];

    return buildingName !== 'NIL'
      ? buildingName + ', ' + address
      : address

  }

  onOptionSelected(locationObj: LocationObj) {
    if (!this.locationSelected) {
      this.locationSelected = locationObj;

      this.tspService.addLocation(this.locationSelected);
      this.mapService.addNewLocationToMap(
        this.locationSelected,
        this.index,
        this.tspService.getLocationsSelected(),
        this.tspService.getModeOfTransport()
      );

    } else {
      this.locationSelected = locationObj;
      this.tspService.replaceAt(this.locationSelected, this.index);
      this.mapService.replaceLocationOnMap(
        this.locationSelected,
        this.index,
        this.tspService.getLocationsSelected(),
        this.tspService.getModeOfTransport()
      )
    }
    this.optionSelected = true;
  }

  onBlur() {
    //This auto populate the previously selected valid option if the current input is an invalid option
    if (this.locationSelected) {
      this.searchFormControl.setValue(this.locationSelected);
    }
  }

  // Think whether to add this feature or not
  // Automatically populate search with first option on Enter key
  // Useful for my development when testing
  onKeydown(keydownEvent: KeyboardEvent) {
    if (keydownEvent.code !== 'Enter' || this.options.length === 0) return;
    this.locationSelected = this.options[0];
    this.searchFormControl.setValue(this.locationSelected);
    this.onOptionSelected(this.locationSelected);
    this.autocomplete.closePanel();
  }
}
