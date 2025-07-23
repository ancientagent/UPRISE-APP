import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-calender",
  templateUrl: "./calender.component.html",
  styleUrls: ["./calender.component.scss"],
})
export class CalenderComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() disabled: boolean;
  @Input() showTime: boolean;
  @Input() timeOnly: boolean;
  @Input() maxLength: number | string = "";
  @Input() hourFormat: any;
  @Input() minDate: any;
  @Input() maxDate: any;
  @Input() showErrorMessage = true;
  @Input() error = "";
  @Input() placeholder = "";
  @Input() type = "";
  @Input() styleClass = "";

  @Input() label = "";
  @Input() className = "";
  @Input() min: any;
  @Input() max: any;
  @Input() inlineStyle = "";

  constructor() {}
  ngOnInit(): void {}

  // public blockSpecial: RegExp = /^[^<>*!]+$/;

  // public blockSpace: RegExp = /[^\s]/;

  // public ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

  // public cc: string = '';
}
