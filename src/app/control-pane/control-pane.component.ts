import { Component, OnInit } from '@angular/core';

import { faBars, faMap, faDirections, faLayerGroup, faMoon, faSun, faMountain, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

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

  activeTab = 'home'

  constructor() { }

  ngOnInit(): void {
  }

  onTabClick(tabClicked: string) {
    this.activeTab = tabClicked;

    //Load panel component
  }

  isActiveIcon(icon: string) {
    return icon === this.activeTab ? { color: 'white' } : {};
  }

}
