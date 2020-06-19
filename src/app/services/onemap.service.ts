import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";
import { DatePipe } from '@angular/common';
import { LocationObj } from '../models/location.model';
import { Observable, from, forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OneMapService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://developers.onemap.sg';
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQ5NTcsInVzZXJfaWQiOjQ5NTcsImVtYWlsIjoiaHVhbmdibHVleW95b0BnbWFpbC5jb20iLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiaHR0cDpcL1wvb20yLmRmZS5vbmVtYXAuc2dcL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE1OTIzNjc3NzQsImV4cCI6MTU5Mjc5OTc3NCwibmJmIjoxNTkyMzY3Nzc0LCJqdGkiOiI5OTMwMmI3Y2Q5MmViYWMyZTI3NjY2YWYxYzU2Mjg1YSJ9.b9mGfQTWoHeyo9YuA65OxBvcQEAds02q5YH5O7Jx1B0'
  private datePipe = new DatePipe('en-SG');

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
      .pipe(map(responseData => {
        return responseData['route_geometry']
      }))

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
}
