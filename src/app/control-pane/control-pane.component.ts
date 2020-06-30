import { Component, OnInit } from '@angular/core';

import { faBars, faMap, faDirections, faLayerGroup, faMoon, faSun, faMountain, faQuestionCircle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from '../services/control-panel.service';
import { Subscription } from 'rxjs';

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
  directionsDisabled = true;

  tabListenerSubscription: Subscription;

  constructor(private controlPanelService: ControlPanelService) { }

  ngOnInit(): void {
    this.activeTab = this.controlPanelService.getActiveTab();
    this.tabListenerSubscription = this.controlPanelService.tabChanged.subscribe(newActiveTab => {
      this.activeTab = newActiveTab;
      if (newActiveTab === 'directions') this.directionsDisabled = false;
    })
  }

  ngOnDestroy() {
    this.tabListenerSubscription.unsubscribe();
  }

  onTabClick(tabClicked: string) {
    if (tabClicked === 'directions' && this.directionsDisabled) return;
    this.controlPanelService.setActiveTab(tabClicked);
  }

  isActiveIcon(icon: string) {
    return icon === this.activeTab ? { color: 'white' } : {};
  }

}
