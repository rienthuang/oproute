import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ControlPanelService {

  private activeTab = 'home';
  private controlPanel: MatSidenav;

  public tabChanged = new Subject<string>();
  public tabDisable = new Subject<string>();

  setActiveTab(newActiveTab: string) {
    this.activeTab = newActiveTab;
    this.tabChanged.next(this.activeTab);
  }

  setDisabledTab(toDisable: string) {
    this.tabDisable.next(toDisable);
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
