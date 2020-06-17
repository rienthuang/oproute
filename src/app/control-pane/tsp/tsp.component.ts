import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';

import { faCaretLeft, faCar, faBusAlt, faWalking, faRoute, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { MapService } from 'src/app/services/map.service';
import { LocationObj } from 'src/app/models/location.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css'],
  providers: [TspService],
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

  locationsSelected;

  MAX_LOCATIONS;

  locationsChangedSubscription: Subscription;

  @ViewChild('transitOption') selectedTransitOption;

  constructor(private controlPanelService: ControlPanelService, private tspService: TspService, private mapService: MapService) { }

  ngOnInit(): void {
    console.log('tspcomponent init');


    this.locationsSelected = this.tspService.getLocationsSelected();
    this.MAX_LOCATIONS = this.tspService.getMaxLocations();

    this.tspService.locationsSelectedChanged.subscribe((updatedLocationsSelected: LocationObj[]) => {

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
  }

  deleteLocation(index: number) {
    //TODO
    this.tspService.deleteLocationAt(index);
  }

}
