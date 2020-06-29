import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { faCaretLeft, faCar, faBusAlt, faWalking, faRoute, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { MapService } from 'src/app/services/map.service';
import { LocationObj } from 'src/app/models/location.model';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SpinnerService } from 'src/app/services/spinner.service';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css'],
  // animations: [
  //   trigger('divFlyAnimation', [
  //     state('in', style({
  //       opacity: 1,
  //       transform: 'translateX(0)'
  //     })),
  //     transition('void => *', [
  //       style({
  //         opacity: 0,
  //         transform: 'translateX(100px)'
  //       }),
  //       animate(300)
  //     ]),
  //     transition('* => void', [
  //       style({
  //         opacity: 0,
  //         transform: 'translateX(-100px)'
  //       }),
  //       animate(300)
  //     ])
  //   ])
  // ]
})
export class TspComponent implements OnInit, OnDestroy {

  faCaretLeft = faCaretLeft;
  faCar = faCar;
  faBusAlt = faBusAlt;
  faWalking = faWalking;
  faHome = faHome;
  faRoute = faRoute;
  faFlagCheckered = faFlagCheckered;

  locationsSelected: LocationObj[];

  MAX_LOCATIONS;

  locationsChangedSubscription: Subscription;

  @ViewChild('transitOption') selectedTransitOption;
  currentTransitOption;


  constructor(private controlPanelService: ControlPanelService, private tspService: TspService, private mapService: MapService, private spinnerService: SpinnerService, private serverService: ServerService) { }

  ngOnInit(): void {
    console.log('tspcomponent init');

    this.locationsSelected = this.tspService.getLocationsSelected();
    this.MAX_LOCATIONS = this.tspService.getMaxLocations();
    this.currentTransitOption = this.tspService.getModeOfTransport();

    this.locationsChangedSubscription = this.tspService.locationsSelectedChanged.subscribe((updatedLocationsSelected: LocationObj[]) => {

      console.log('locations changed captured');
      console.log(updatedLocationsSelected);

      this.locationsSelected = updatedLocationsSelected;
    })
  }

  ngOnDestroy(): void {
    this.locationsChangedSubscription.unsubscribe();
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

  transitChanged() {
    this.tspService.setModeOfTransport(this.selectedTransitOption.value);
    this.currentTransitOption = this.selectedTransitOption.value;
    if (this.locationsSelected.length > 1) this.mapService.recalculateRoute(this.locationsSelected, this.selectedTransitOption.value);
  }

  deleteLocation(index: number) {
    this.tspService.deleteLocationAt(index);
    this.mapService.deletePolylineAt(index, this.tspService.getLocationsSelected(), this.selectedTransitOption.value, { color: 'red', weight: 5 })
    this.mapService.deleteMarkerAt(index);
  }

  solveTsp() {
    this.serverService.solveTsp(this.locationsSelected)
      .subscribe((response: number[]) => {
        let optimizedLocations = [];
        response.forEach(order => {
          optimizedLocations.push(this.locationsSelected[order])
        });
        console.log(optimizedLocations);
        this.tspService.setOptimizedLocations(optimizedLocations);
        this.controlPanelService.setActiveTab('directions');
      })
  }

}
