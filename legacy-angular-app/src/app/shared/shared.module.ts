import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ComponentsModule } from "./components/components.module";
import { PrimeUiModule } from "./primeUi/prime-ui.module";
import { ToastrModule } from "ngx-toastr";
import { DatePipe } from './pipes/date.pipe';


@NgModule({
  imports: [
    CommonModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      // disableTimeOut:true,
      resetTimeoutOnDuplicate: true,
      preventDuplicates: true,
      positionClass: "toast-top-right",
      closeButton:true
    }),
  ],
  exports: [ComponentsModule, PrimeUiModule],
  declarations: [
    DatePipe
  ],
})
export class SharedModule {}
