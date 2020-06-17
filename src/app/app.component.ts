import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlPanelService } from './services/control-panel.service';
import { MatSidenav } from '@angular/material/sidenav';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  controlPaneOpened = false;
  title = 'angular-leaflet';


  @ViewChild('controlpane') public controlPanel: MatSidenav;

  constructor(private controlPanelService: ControlPanelService) { }

  ngAfterViewInit(): void {
    this.controlPanelService.setControlPanel(this.controlPanel);
  }



}
