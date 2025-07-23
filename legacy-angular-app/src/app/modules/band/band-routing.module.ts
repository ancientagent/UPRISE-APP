import { Component, NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BandComponent } from "./band/band.component";
import { BrandMemberlistComponent } from "./brand-memberlist/brand-memberlist.component";
import { EventsManagementComponent } from "./events-management/events-management.component";
import { ProfileComponent } from "./profile/profile.component";
import { SongsManagementComponent } from "./songs-management/songs-management.component";
import { AuthenticationGuard } from "../../api/authentication.guard";
import { AdsComponent } from "./ads/ads.component";
const routes: Routes = [
  {
    path: "",
    component: BandComponent,
    children: [
      { path: "", redirectTo: "songsmanagement" },
      {
        path: "songsmanagement",
        children: [
          { path: "", redirectTo: "songs" },
          {
            path: "songs",
            component: SongsManagementComponent,
            canActivate: [AuthenticationGuard],
          },
          // {
          //   path: "albums",
          //   component: SongsManagementComponent,
          //   canActivate: [AuthenticationGuard],
          // },
          // {
          //   path: "albums/songs",
          //   component: SongsManagementComponent,
          //   canActivate: [AuthenticationGuard],
          // },
        ],
      },
      {
        path: "event",
        component: EventsManagementComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "ads-management",
        component: AdsComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "banddetails",
        component: BrandMemberlistComponent,
        canActivate: [AuthenticationGuard],
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BandRoutingModule {}
