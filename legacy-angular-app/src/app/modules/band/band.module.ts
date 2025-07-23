import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BandRoutingModule } from "./band-routing.module";
import { SongsManagementComponent } from "./songs-management/songs-management.component";
import { EventsManagementComponent } from "./events-management/events-management.component";
import { ProfileComponent } from "./profile/profile.component";
import { BrandMemberlistComponent } from "./brand-memberlist/brand-memberlist.component";
import { BandComponent } from "./band/band.component";
import { ComponentsModule } from "src/app/shared/components/components.module";

import { SharedModule } from "src/app/shared/shared.module";

import { HttpClientModule } from "@angular/common/http";
import { NgxSpinnerModule } from "ngx-spinner";
import { MultiSelectModule } from "primeng/multiselect";
import { MinuteSecondsPipe } from "src/app/shared/pipes/minute-seconds.pipe";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AdsComponent } from './ads/ads.component';

@NgModule({
  declarations: [
    SongsManagementComponent,
    EventsManagementComponent,
    ProfileComponent,
    BrandMemberlistComponent,
    BandComponent,
    MinuteSecondsPipe,
    AdsComponent,

  ],
  imports: [
    CommonModule,
    BandRoutingModule,
    ComponentsModule,
    SharedModule,
    HttpClientModule,
    NgxSpinnerModule,
    MultiSelectModule,
    GooglePlaceModule
  ],
})
export class BandModule {}
