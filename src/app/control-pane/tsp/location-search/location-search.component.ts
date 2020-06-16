import { Component, OnInit } from '@angular/core';
import { OneMapService } from 'src/app/services/onemap.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.css']
})
export class LocationSearchComponent implements OnInit {

  searchFormControl = new FormControl();
  options = [];

  constructor(private oneMapService: OneMapService) { }

  ngOnInit(): void {
  }

  onSearchChange(searchValue: string): void {
    if (searchValue.length) {
      this.oneMapService.getAutocompleteSearch(searchValue)
        .subscribe((response) => {
          this.options = response['results'];
        })
    } else {
      this.options = [];
    }
  }

  displayFn(addressObj) {
    if (addressObj) {

      let buildingName = addressObj['BUILDING'];
      let address = addressObj['ADDRESS'];

      return buildingName !== 'NIL'
        ? buildingName
        : address
    }
  }

  onOptionSelected() {
    this.options = [];
  }

}
