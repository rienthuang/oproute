import { NgModule } from '@angular/core';
import { MatSliderModule } from "@angular/material/slider";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";


const MaterialComponents = [
  MatSliderModule,
  MatSidenavModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatIconModule,
  MatAutocompleteModule,
  MatFormFieldModule,
  MatInputModule,
  MatTooltipModule,
  MatProgressSpinnerModule,
  DragDropModule,
  MatSlideToggleModule
]


@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
