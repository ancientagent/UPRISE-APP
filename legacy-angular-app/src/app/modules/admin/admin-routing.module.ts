import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthenticationGuard } from "src/app/api/authentication.guard";
import { AdminComponent } from "./admin/admin.component";
import { AdsManagementComponent } from "./ads-management/ads-management.component";
import { BrandMemberlistComponent } from "./brand-memberlist/brand-memberlist.component";
import { EventsManagementComponent } from "./events-management/events-management.component";
import { ProfileComponent } from "./profile/profile.component";
import { SongsManagementComponent } from "./songs-management/songs-management.component";
import { StatisticsComponent } from "./statistics/statistics.component";
import { UserManagementComponent } from "./user-management/user-management.component";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    children: [
      { path: "", redirectTo: "user-management" },

      {
        path: "content-management",
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
        path: "profile",
        component: ProfileComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "brandmemberlist",
        component: BrandMemberlistComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "ads-management",
        component: AdsManagementComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "user-management",
        component: UserManagementComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: "statistics",
        component: StatisticsComponent,
        canActivate: [AuthenticationGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
