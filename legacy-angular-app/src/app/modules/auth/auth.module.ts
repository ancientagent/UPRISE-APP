import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { SignupComponent } from "./signup/signup.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { AuthComponent } from "./auth/auth.component";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PrimeUiModule } from "src/app/shared/primeUi/prime-ui.module";
import { LoginLayoutComponent } from "./login-layout/login-layout.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";
import { BandInviteConfirmComponent } from "../band/band-invite-confirm/band-invite-confirm.component";
import { ListenerProfileComponent } from './listener-profile/listener-profile.component';
import { CommonBandComponentComponent } from './common-band-component/common-band-component.component';
import { LoginMessageComponent } from './login-message/login-message.component';
import { RegisterSuccessComponent } from './register-success/register-success.component';

@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    SignupComponent,
    ForgotPasswordComponent,
    LoginLayoutComponent,
    ChangePasswordComponent,
    BandInviteConfirmComponent,
    ListenerProfileComponent,
    CommonBandComponentComponent,
    LoginMessageComponent,
    RegisterSuccessComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    AuthRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    PrimeUiModule,
  ],
})
export class AuthModule {}
