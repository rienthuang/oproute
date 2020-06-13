import { Component, OnInit, ViewChild } from '@angular/core';

import { faCaretLeft, faCar, faBusAlt, faWalking } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css']
})
export class TspComponent implements OnInit {

  faCaretLeft = faCaretLeft;
  faCar = faCar;
  faBusAlt = faBusAlt;
  faWalking = faWalking;

  @ViewChild('transitOption') selectedTransitOption;

  constructor(private controlPanelService: ControlPanelService) { }

  ngOnInit(): void {
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

  print() {
    console.log(this.selectedTransitOption.value);

  }

}
