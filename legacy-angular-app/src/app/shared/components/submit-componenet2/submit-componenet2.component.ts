import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-submit-component2",
  templateUrl: "./submit-componenet2.component.html",
  styleUrls: ["./submit-componenet2.component.scss"],
})
export class SubmitComponenet2Component implements OnInit {
  @Input() type: string = "";
  @Input() class: string = "";
  @Input() disabled: boolean = false;
  @Input() icon: string = "";
  @Input() label: string = "";
  @Input() message: string = "";
  @Input() ifHasError: boolean = false;
  @Input() loading: boolean = false;
  @Input() showIcon: boolean = false;
  @Output() submitForm = new EventEmitter<any>();
  @Input() inlineStyle = "";
  style: string =
    "  background: #906dd5;border: 0.6px solid #906dd5;width: 100%;color: #ffffff; border-radius:30px;box-sizing: border-box;box-shadow:none";
  constructor() {}
  ngOnInit(): void {
    this.style = this.style + this.inlineStyle;
  }
  onSubmit(): void {
    this.submitForm.emit();
  }
}
