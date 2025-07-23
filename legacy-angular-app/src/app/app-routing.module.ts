import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./modules/auth/auth/auth.component";
//import { AuthGuard } from './api/services/auth-gurd.service';
const routes: Routes = [
  // {
  //   path: "",
  //   redirectTo: "/signIn",
  //   pathMatch: "full",
  // },
  {
    path: "",
    // component: AuthComponent,
    children: [
      {
        path: "",
        loadChildren: () =>
          import("./modules/auth/auth.module").then((m) => m.AuthModule),
      },
    ],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./modules/admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "band",
    loadChildren: () =>
      import("./modules/band/band.module").then((m) => m.BandModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
