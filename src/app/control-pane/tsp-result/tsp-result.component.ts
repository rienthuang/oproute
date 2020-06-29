import { Component, OnInit } from '@angular/core';
import { faCaretLeft, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';
import { Subscription } from 'rxjs';
import { LocationObj } from 'src/app/models/location.model';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { eventNames } from 'process';
import { MapService } from 'src/app/services/map.service';
import { ServerService } from 'src/app/services/server.service';

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
  listDirty = false;
  recalculateSpinner = false;

  optLocationSubsription: Subscription;

  constructor(private controlPanelService: ControlPanelService, private tspService: TspService, private mapService: MapService, private serverService: ServerService) { }

  ngOnInit(): void {
    if (this.tspService.getCustomRoute().length !== 0) {
      this.optimizedLocations = this.tspService.getCustomRoute();
      this.listDirty = true;
    } else {
      this.optimizedLocations = this.tspService.getOptimizedLocations();
    }
  }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === 0 || event.previousIndex === this.optimizedLocations.length - 1 || event.currentIndex === 0 || event.currentIndex === this.optimizedLocations.length - 1) return;
    if (event.previousIndex === event.currentIndex) return;
    this.listDirty = true;
    moveItemInArray(this.optimizedLocations, event.previousIndex, event.currentIndex)
    this.mapService.resetAndBuildOptimizedMap(this.optimizedLocations, this.tspService.getModeOfTransport());
    this.tspService.setCustomRoute(this.optimizedLocations);
  }

  getOptimalRoute() {
    this.optimizedLocations = this.tspService.getOptimizedLocations();
    this.mapService.resetAndBuildOptimizedMap(this.optimizedLocations, this.tspService.getModeOfTransport());
    this.listDirty = false;
  }
}
