import { Component, OnInit, ViewChild } from '@angular/core';

import { faCaretLeft, faCar, faBusAlt, faWalking, faRoute, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';
import { trigger, style, state, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css'],
  providers: [TspService],
  animations: [
    trigger('divFlyAnimation', [
      state('in', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateX(100px)'
        }),
        animate(300)
      ]),
      transition('* => void', [
        style({
          opacity: 0,
          transform: 'translateX(-100px)'
        }),
        animate(300)
      ])
    ])
  ]
})
export class TspComponent implements OnInit {

  faCaretLeft = faCaretLeft;
  faCar = faCar;
  faBusAlt = faBusAlt;
  faWalking = faWalking;
  faHome = faHome;
  faRoute = faRoute;
  faFlagCheckered = faFlagCheckered;

  locationsSelected;

  MAX_LOCATIONS;

  @ViewChild('transitOption') selectedTransitOption;

  constructor(private controlPanelService: ControlPanelService, private tspService: TspService) { }

  ngOnInit(): void {
    this.locationsSelected = this.tspService.getLocationsSelected();
    this.MAX_LOCATIONS = this.tspService.getMaxLocations();
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

  transitChanged() {
    this.tspService.setModeOfTransport(this.selectedTransitOption.value);
  }

}
