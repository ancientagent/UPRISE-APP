import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AdminRoutingModule } from "./admin-routing.module";
import { SongsManagementComponent } from "./songs-management/songs-management.component";
import { EventsManagementComponent } from "./events-management/events-management.component";
import { ProfileComponent } from "./profile/profile.component";
import { BrandMemberlistComponent } from "./brand-memberlist/brand-memberlist.component";
import { AdminComponent } from "./admin/admin.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { HttpClientModule } from "@angular/common/http";
import { UserManagementComponent } from "./user-management/user-management.component";
import { AdsManagementComponent } from "./ads-management/ads-management.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { MultiSelectModule } from "primeng/multiselect";
import { AdminPipe } from "src/app/shared/pipes/admin.pipe";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { AutoCompleteModule } from "primeng/autocomplete";



@NgModule({
  declarations: [
    SongsManagementComponent,
    EventsManagementComponent,
    ProfileComponent,
    BrandMemberlistComponent,
    AdminComponent,
    UserManagementComponent,
    AdsManagementComponent,
    StatisticsComponent,
    AdminPipe,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ComponentsModule,
    SharedModule,
    MultiSelectModule,
    HttpClientModule,
    NgxSpinnerModule,
    GooglePlaceModule,
    AutoCompleteModule,
  ],
})
export class AdminModule {}
