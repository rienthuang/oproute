import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { LocationObj } from '../models/location.model';
import { Coord } from '../models/coord.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as alertify from 'alertifyjs';

@Injectable({ providedIn: 'root' })
export class ServerService {

  private serverUrl = 'http://localhost:8080/';

  constructor(private http: HttpClient) { }

  solveTsp(locations: LocationObj[]): Observable<any> {

    let transformedLocations: Coord[] = [];

    locations.forEach(location => {
      let name = location.SEARCHVAL;
      let lat = +location.LATITUDE;
      let long = +location.LONGITUDE;
      transformedLocations.push(new Coord(name, lat, long));
    });
    let url = this.serverUrl + '/solve/tsp';
    return this.http.post(url, transformedLocations)
      .pipe(
        catchError(err => this.handleError(err))
      )
  }

  handleError(error: HttpErrorResponse) {
    let userErrorMsg = error.message;
    alertify.error(userErrorMsg);
    return throwError(userErrorMsg);
  }
}
