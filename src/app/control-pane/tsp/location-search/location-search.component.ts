import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { OneMapService } from 'src/app/services/onemap.service';
import { FormControl } from '@angular/forms';
import { TspService } from 'src/app/services/tsp.service';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LocationSearchComponent implements OnInit {

  searchFormControl = new FormControl();

  options = [];
  locationSelected;

  @Input('location_index') index;

  constructor(private oneMapService: OneMapService, private tspService: TspService) { }

  ngOnInit(): void {

    let locationExist = this.tspService.getLocationAt(this.index)
    if (locationExist) {
      this.locationSelected = locationExist;
      this.searchFormControl.setValue(locationExist);
    }
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.length > 1) {
      this.oneMapService.getAutocompleteSearch(searchValue)
        .subscribe((response) => {
          this.options = response['results'];
        })
    }
  }

  displayFn(locationObj) {
    if (locationObj) {

      let buildingName = locationObj['BUILDING'];
      let address = locationObj['ADDRESS'];

      return buildingName !== 'NIL'
        ? buildingName
        : address
    }
  }

  displayString(locationObj): string {
    let buildingName = locationObj['BUILDING'];
    let address = locationObj['ADDRESS'];

    return buildingName !== 'NIL'
      ? buildingName + ', ' + address
      : address

  }

  onOptionSelected(locationObj) {
    if (!this.locationSelected) {
      this.locationSelected = locationObj;
      this.tspService.addLocation(this.locationSelected);
    } else {
      this.locationSelected = locationObj;
      this.tspService.replaceAt(this.locationSelected, this.index);
    }
  }

  onBlur() {
    //This method forces the search bar to contain a value from the options provided
    if (this.options.length > 0) {
      this.searchFormControl.setValue(this.options[0]);
    } else {
      this.searchFormControl.setValue(this.locationSelected);
    }
  }
}
