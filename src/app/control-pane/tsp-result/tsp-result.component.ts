import { Component, OnInit } from '@angular/core';
import { faCaretLeft, faHome, faFlagCheckered } from "@fortawesome/free-solid-svg-icons";
import { ControlPanelService } from 'src/app/services/control-panel.service';
import { TspService } from 'src/app/services/tsp.service';

@Component({
  selector: 'app-tsp-result',
  templateUrl: './tsp-result.component.html',
  styleUrls: ['./tsp-result.component.css']
})
export class TspResultComponent implements OnInit {

  faCaretLeft = faCaretLeft;
  faHome = faHome;
  faFlagCheckered = faFlagCheckered;

  movies = [
    'Episode I - The Phantom Menace',
    'Episode II - Attack of the Clones',
    'Episode III - Revenge of the Sith',
    'Episode IV - A New Hope',
    'Episode V - The Empire Strikes Back',
    'Episode VI - Return of the Jedi',
    'Episode VII - The Force Awakens',
    'Episode VIII - The Last Jedi',
    'Episode IX – The Rise of Skywalker'
  ];


  constructor(private controlPanelService: ControlPanelService) { }

  ngOnInit(): void { }

  closeControlPanel() {
    this.controlPanelService.closeControlPanel();
  }
}
