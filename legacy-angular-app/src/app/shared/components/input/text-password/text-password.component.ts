import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "app-text-password",
  templateUrl: "./text-password.component.html",
  styleUrls: ["./text-password.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TextPasswordComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() disabled: boolean;
  @Input() maxlength: number;
  @Input() minlength: number;
  @Input() showErrorMessage = true;
  @Input() error = "";
  @Input() placeholder = "";
  @Input() type = "";

  @Input() pKeyFilter: string;
  @Input() label = "";
  @Input() className = "";
  @Input() min: any;
  @Input() max: any;
  @Input() inlineStyle = "";
  visable:boolean = false;
  passwordType:string = "password";
  style: string =
    "  background: #0f0f0f;border: 0.6px solid rgba(240, 240, 240, 0.3);width: 100%;color: #ffffff;box-sizing: border-box;border-radius: 2px;padding-left: 1.7rem;";
  constructor() {}
  ngOnInit(): void {
    this.style = this.style + this.inlineStyle;
  }

  // public blockSpecial: RegExp = /^[^<>*!]+$/;

  // public blockSpace: RegExp = /[^\s]/;

  // public ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

  // public cc: string = "";
  visableEye(){
    this.visable = true
    this.passwordType = "text"
  }
  invisableEye(){
    this.visable = false
    this.passwordType = "password"
  }
  onKeydown(event) {
    if (event.keyCode === 32 ) {
      return false;
    }
  }
}
