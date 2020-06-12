import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapLayerComponent } from './map/map-layer/map-layer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ControlPaneComponent } from './control-pane/control-pane.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapLayerComponent,
    ControlPaneComponent,
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    LeafletModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
