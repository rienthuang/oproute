import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapLayerComponent } from './map/map-layer/map-layer.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapLayerComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    LeafletModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
