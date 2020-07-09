import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { ControlPanelService } from './services/control-panel.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SpinnerService } from './services/spinner.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {

  controlPaneOpened = window.screen.width <= 815 ? false : true;
  title = 'angular-leaflet';
  showMapSpinner = false;

  mapChanging: Subscription;


  @ViewChild('controlpane') public controlPanel: MatSidenav;

  constructor(private controlPanelService: ControlPanelService, private spinnerService: SpinnerService) { }

  ngOnInit() {
    this.mapChanging = this.spinnerService.mapIsChanging.subscribe(newStatus => this.showMapSpinner = newStatus);
  }

  ngAfterViewInit(): void {
    this.controlPanelService.setControlPanel(this.controlPanel);
  }

  ngOnDestroy() {
    this.mapChanging.unsubscribe();
  }

}
