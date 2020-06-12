import { NgModule } from '@angular/core';
import { MatSliderModule } from "@angular/material/slider";
import { MatSidenavModule } from "@angular/material/sidenav";

const MaterialComponents = [
  MatSliderModule,
  MatSidenavModule
]


@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
