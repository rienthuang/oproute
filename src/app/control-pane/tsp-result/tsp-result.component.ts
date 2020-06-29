import { Component, OnInit } from '@angular/core';
import { faCaretLeft, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';
import { Subscription } from 'rxjs';
import { LocationObj } from 'src/app/models/location.model';

@Component({
  selector: 'app-tsp-result',
  templateUrl: './tsp-result.component.html',
  styleUrls: ['./tsp-result.component.css']
})
export class TspResultComponent implements OnInit {

  faCaretLeft = faCaretLeft;
  faHome = faHome;
  faFlagCheckered = faFlagCheckered;

  optimizedLocations: LocationObj[] = [];

  optLocationSubsription: Subscription;

  constructor(private controlPanelService: ControlPanelService, private tspService: TspService) { }

  ngOnInit(): void {
    this.optimizedLocations = this.tspService.getOptimizedLocations();
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }
}
