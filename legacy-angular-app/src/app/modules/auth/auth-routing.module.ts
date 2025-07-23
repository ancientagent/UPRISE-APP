import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BandInviteConfirmComponent } from "../band/band-invite-confirm/band-invite-confirm.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { CommonBandComponentComponent } from "./common-band-component/common-band-component.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { ListenerProfileComponent } from "./listener-profile/listener-profile.component";
import { LoginLayoutComponent } from "./login-layout/login-layout.component";
import { LoginMessageComponent } from "./login-message/login-message.component";
import { LoginComponent } from "./login/login.component";
import { RegisterSuccessComponent } from "./register-success/register-success.component";
import { SignupComponent } from "./signup/signup.component";

const routes: Routes = [
  {
    path: "",
    children: [
      { path: "signIn", component: LoginComponent },
      { path: "", redirectTo: "signIn" , pathMatch: "full"},
      { path: "signUp", component: SignupComponent },
      { path: "forgot", component: ForgotPasswordComponent },
      { path: "change-password", component: ChangePasswordComponent },
      {
        path: "bandinvite",
        component: BandInviteConfirmComponent,
      },
      {
        path: "band-denied",
        component: CommonBandComponentComponent,
      },
      {
        path: "band-accepted",
        component: CommonBandComponentComponent,
      },
      {
        path: "profilecreated",
        component: CommonBandComponentComponent,
      },
      {
        path: "listenerprofile/signup",
        component: ListenerProfileComponent,
      },
      {
        path: "dashboard-fallback",
        component: LoginLayoutComponent,
      },
      {
        path: "login-message",
        component: LoginMessageComponent,
      },
      {
        path: "register-success",
        component: RegisterSuccessComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
