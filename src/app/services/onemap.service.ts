import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class OneMapService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://developers.onemap.sg';
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQ5NTcsInVzZXJfaWQiOjQ5NTcsImVtYWlsIjoiaHVhbmdibHVleW95b0BnbWFpbC5jb20iLCJmb3JldmVyIjpmYWxzZSwiaXNzIjoiaHR0cDpcL1wvb20yLmRmZS5vbmVtYXAuc2dcL2FwaVwvdjJcL3VzZXJcL3Nlc3Npb24iLCJpYXQiOjE1OTIzNjc3NzQsImV4cCI6MTU5Mjc5OTc3NCwibmJmIjoxNTkyMzY3Nzc0LCJqdGkiOiI5OTMwMmI3Y2Q5MmViYWMyZTI3NjY2YWYxYzU2Mjg1YSJ9.b9mGfQTWoHeyo9YuA65OxBvcQEAds02q5YH5O7Jx1B0'

  getAutocompleteSearch(query: string) {
    let searchUrl = this.baseUrl + '/commonapi/search?searchVal=' + query + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return this.http.get(searchUrl);
  }

  getRoute(from, to, transportMode) {

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
  }

}
