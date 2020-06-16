import { Component, OnInit, ViewChild } from '@angular/core';

import { faCaretLeft, faCar, faBusAlt, faWalking, faRoute, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css'],
  providers: [TspService]
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

  @ViewChild('transitOption') selectedTransitOption;

  constructor(private controlPanelService: ControlPanelService, private tspService: TspService) { }

  ngOnInit(): void {
    this.locationsSelected = this.tspService.getLocationsSelected();
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

}
