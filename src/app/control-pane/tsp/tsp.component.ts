import { Component, OnInit } from '@angular/core';

import { faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';

@Component({
  selector: 'app-tsp',
  templateUrl: './tsp.component.html',
  styleUrls: ['./tsp.component.css']
})
export class TspComponent implements OnInit {

  faCaretLeft = faCaretLeft;

  constructor(private controlPanelService: ControlPanelService) { }

  ngOnInit(): void {
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

}
