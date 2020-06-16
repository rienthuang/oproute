import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class OneMapService {

  constructor(private http: HttpClient) { }

  private baseUrl = 'https://developers.onemap.sg';

  getAutocompleteSearch(query: string) {
    let searchUrl = this.baseUrl + '/commonapi/search?searchVal=' + query + '&returnGeom=Y&getAddrDetails=Y&pageNum=1'
    return this.http.get(searchUrl);
  }
}
