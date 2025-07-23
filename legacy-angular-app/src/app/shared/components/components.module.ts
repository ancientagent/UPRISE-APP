import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrimeUiModule } from "../primeUi/prime-ui.module";
import { SubmitComponentComponent } from "./input/submit-component/submit-component.component";
import { TextBoxComponent } from "./input/text-box/text-box.component";
import { TextPasswordComponent } from "./input/text-password/text-password.component";
import { DropdownComponent } from "./input/dropdown/dropdown.component";
import { AutocompleteComponent } from "./input/autocomplete/autocomplete.component";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { InputBoxLoginComponent } from "./input-box-login/input-box-login.component";
import { CheckBoxComponent } from "./input/check-box/check-box.component";
import { InputTextareaComponent } from "./input/input-textarea/input-textarea.component";
import { CalenderComponent } from "./input/calender/calender.component";
import { HeaderComponent } from "./header/header.component";
import { SidenavComponent } from "./sidenav/sidenav.component";
import { MultiSelectComponent } from "./input/multi-select/multi-select.component";
import { SubmitComponenet2Component } from "./submit-componenet2/submit-componenet2.component";
import { AvatarComponent } from './avatar/avatar.component';
import { BandComponent } from './input/band/band.component';
import { DeleteComponent } from './delete/delete.component';
import { NgxSpinnerModule } from "ngx-spinner";

import { SpinnerComponent } from './spinner/spinner.component';
import { ToggleSwitchComponent } from './input/toggle-switch/toggle-switch.component';
import { BlockComponent } from './block/block.component';
import { UploadButtonComponent } from './input/upload-button/upload-button.component';

@NgModule({
  declarations: [
    TextBoxComponent,
    TextPasswordComponent,
    SubmitComponentComponent,
    DropdownComponent,
    AutocompleteComponent,
    LoadingSpinnerComponent,
    InputBoxLoginComponent,
    CheckBoxComponent,
    InputTextareaComponent,
    CalenderComponent,
    HeaderComponent,
    SidenavComponent,
    MultiSelectComponent,
    SubmitComponenet2Component,
    AvatarComponent,
    BandComponent,
    DeleteComponent,
    SpinnerComponent,
    ToggleSwitchComponent,
    BlockComponent,
    UploadButtonComponent,
    
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, PrimeUiModule,NgxSpinnerModule],
  exports: [
    TextBoxComponent,
    TextPasswordComponent,
    SubmitComponentComponent,
    FormsModule,
    ReactiveFormsModule,
    DropdownComponent,
    LoadingSpinnerComponent,
    InputBoxLoginComponent,
    CheckBoxComponent,
    InputTextareaComponent,
    CalenderComponent,
    HeaderComponent,
    SidenavComponent,
    SubmitComponenet2Component,
    AutocompleteComponent,
    AvatarComponent,
    BandComponent,
    DeleteComponent,
    SpinnerComponent,
    ToggleSwitchComponent,
    BlockComponent,
    UploadButtonComponent,
  ],
})
export class ComponentsModule {}
