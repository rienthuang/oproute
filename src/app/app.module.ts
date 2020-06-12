import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { NgxSidebarControlModule } from "@runette/ngx-leaflet-sidebar";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { MapLayerComponent } from './map/map-layer/map-layer.component';
import { SidebarComponent } from './map/sidebar/sidebar.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    MapLayerComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule,
    FontAwesomeModule,
    LeafletModule,
    NgxSidebarControlModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
