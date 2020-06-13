import { Component, OnInit } from '@angular/core';

import { faBars, faMap, faDirections, faLayerGroup, faMoon, faSun, faMountain, faQuestionCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from '../services/control-panel.service';

@Component({
  selector: 'app-control-pane',
  templateUrl: './control-pane.component.html',
  styleUrls: ['./control-pane.component.css']
})
export class ControlPaneComponent implements OnInit {

  faBars = faBars;
  faMap = faMap;
  faDirections = faDirections;
  faLayerGroup = faLayerGroup;
  faMoon = faMoon;
  faSun = faSun;
  faMountain = faMountain;
  faQuestionCircle = faQuestionCircle;
  faInfoCircle = faInfoCircle;

  activeTab;

  constructor(private controlPanelService: ControlPanelService) { }

  ngOnInit(): void {
    this.activeTab = this.controlPanelService.getActiveTab();
  }

  onTabClick(tabClicked: string) {
    this.activeTab = this.controlPanelService.setActiveTab(tabClicked);

    //Load panel component
  }

  isActiveIcon(icon: string) {
    return icon === this.activeTab ? { color: 'white' } : {};
  }

}
