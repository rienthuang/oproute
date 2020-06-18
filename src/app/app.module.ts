import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { DragDropModule } from "@angular/cdk/drag-drop";

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapLayerComponent } from './map/map-layer/map-layer.component';
import { MaterialModule } from './material/material.module';
import { ControlPaneComponent } from './control-pane/control-pane.component';
import { TspComponent } from './control-pane/tsp/tsp.component';
import { LocationSearchComponent } from './control-pane/tsp/location-search/location-search.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapLayerComponent,
    ControlPaneComponent,
    TspComponent,
    LocationSearchComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    FontAwesomeModule,
    LeafletModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
