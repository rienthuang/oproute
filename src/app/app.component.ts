import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  controlPaneOpened = false;
  title = 'angular-leaflet';


  openControlPane(pane) {
    pane.open();
  }

  closeControlPane(pane) {
    pane.close();
  }

}
