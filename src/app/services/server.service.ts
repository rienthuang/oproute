import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LocationObj } from '../models/location.model';
import { Coord } from '../models/coord.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment'
import * as alertify from 'alertifyjs';

@Injectable({ providedIn: 'root' })
export class ServerService {

  private serverUrl = environment.serverUrl;

  constructor(private http: HttpClient) { }

  solveTsp(locations: LocationObj[], isAtoZ: boolean): Observable<any> {

    let transformedLocations: Coord[] = [];

    locations.forEach(location => {
      let name = location.SEARCHVAL;
      let lat = +location.LATITUDE;
      let long = +location.LONGITUDE;
      transformedLocations.push(new Coord(name, lat, long));
    });

    let url = this.serverUrl + 'solve/tsp';
    isAtoZ
      ? url += '/AtoZ'
      : url += '/roundtrip'

    return this.http.post(url, transformedLocations)
      .pipe(
        catchError(err => this.handleError(err))
      )
  }

  getToken() {
    let url = this.serverUrl + 'api/token';
    return this.http.get(url);
  }

  handleError(error: HttpErrorResponse) {
    let userErrorMsg = 'Server is down. Please try again later.';
    console.log(error.message);
    alertify.error(userErrorMsg);
    return throwError(userErrorMsg);
  }
}
