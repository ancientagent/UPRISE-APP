import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { HttpConfigInterceptor } from "./api/interceptor/http-config.interceptor";
import { SharedModule } from "./shared/shared.module";
import { RouterModule } from "@angular/router";
import { AuthComponent } from "./modules/auth/auth/auth.component";
import { ComponentsModule } from "./shared/components/components.module";
import { AuthguardserviceService } from "./api/services/authguardservice.service";
import { LayoutComponent } from "./layout/layout.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { ConfirmationService } from "primeng/api";

@NgModule({
  declarations: [AppComponent, LayoutComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    ComponentsModule,
    HttpClientModule,
    FormsModule,
    NgxSpinnerModule,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthguardserviceService,
    ConfirmationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpConfigInterceptor,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
