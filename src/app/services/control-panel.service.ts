import { Injectable } from '@angular/core';
import { control } from 'leaflet';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({ providedIn: 'root' })
export class ControlPanelService {

  private activeTab = 'home';
  private controlPanel: MatSidenav;

  setActiveTab(newActiveTab: string) {
    this.activeTab = newActiveTab;
    return this.activeTab;
  }

  getActiveTab() {
    return this.activeTab
  }

  public setControlPanel(controlPane: MatSidenav) {
    this.controlPanel = controlPane;
  }

  public closeControlPanel(): void {
    this.controlPanel.close();
  }

  public openControlPanel(): void {
    this.controlPanel.open();
  }



}
