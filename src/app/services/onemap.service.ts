import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';

import { map, catchError } from "rxjs/operators";
import { LocationObj } from '../models/location.model';
import { Observable, forkJoin, throwError } from 'rxjs';
import { SpinnerService } from './spinner.service';
import { environment } from "../../environments/environment";
import * as alertify from 'alertifyjs';


@Injectable({ providedIn: 'root' })
export class OneMapService {

  private baseUrl = 'https://developers.onemap.sg';
  private token = environment.oneMapAPIKey;

  constructor(private http: HttpClient, private spinnerService: SpinnerService) { }

  getAutocompleteSearch(query: string) {
    let searchUrl = this.baseUrl + '/commonapi/search?searchVal=' + query + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return this.http.get(searchUrl);
  }

  getGeometryRoute(from: LocationObj, to: LocationObj, transportMode: string): Observable<string> {

    let fromLat = from['LATITUDE'];
    let fromLong = from['LONGITUDE'];

    let toLat = to['LATITUDE'];
    let toLong = to['LONGITUDE'];

    let url = this.baseUrl + '/privateapi/routingsvc/route'

    let params = {
      start: fromLat + ',' + fromLong,
      end: toLat + ',' + toLong,
      routeType: transportMode,
      token: this.token
    }

    return this.http.get(url, { params: params })
      .pipe(
        map(responseData => {
          return responseData['route_geometry']
        }),
        catchError(err => this.handleError(err))
      )

  }

  getGeometryRoutes(locations: LocationObj[], transportMode: string): Observable<string[]> {
    if (locations.length < 2) return;

    let geometryRouteObservables: Observable<string>[] = [];

    for (let i = 0; i < locations.length; i++) {
      if (i === 0) continue;

      let fromLocation: LocationObj = locations[i - 1];
      let toLocation: LocationObj = locations[i];
      geometryRouteObservables.push(this.getGeometryRoute(fromLocation, toLocation, transportMode))
    }
    return forkJoin(geometryRouteObservables);
  }

  handleError(error: HttpErrorResponse) {
    let userErrorMsg = 'Unknown error occured. Please try again later.';
    let apiErrorMsg: string = error.error.error;

    if (error.status === 400 || error.status === 401) userErrorMsg = 'Error occured on server. We are working on it!';
    if (error.status === 408) userErrorMsg = 'Request time out. Please try again later.'
    if (error.status === 500) userErrorMsg = 'Internal server error. Please try again.'
    if (apiErrorMsg.includes('Unable to get walk path')) userErrorMsg = 'Mo walking route found!'

    console.log(error);
    alertify.error(userErrorMsg);
    this.spinnerService.mapIsChanging.next(false);
    return throwError(userErrorMsg)
  }

}
