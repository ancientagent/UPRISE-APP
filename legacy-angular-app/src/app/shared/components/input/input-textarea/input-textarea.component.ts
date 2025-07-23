import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-input-textarea",
  templateUrl: "./input-textarea.component.html",
  styleUrls: ["./input-textarea.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class InputTextareaComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() disabled: boolean;
  @Input() maxLength: number | string = "";
  @Input() showErrorMessage = true;
  @Input() error = "";
  @Input() placeholder = "";
  @Input() type = "";
  @Input() rows;
  @Input() cols;

  @Input() label = "";
  @Input() className = "";
  @Input() min: any;
  @Input() max: any;

  @Input() inlineStyle = "";
  style: string =
    "  background: #0f0f0f;border: 0.6px solid rgba(240, 240, 240, 0.3);width: 100%;color: #ffffff;box-sizing: border-box;border-radius: 2px;padding-left: 1.7rem; height: 100%; min-height:130px ;max-height:130px ;";
  constructor() {}
  ngOnInit(): void {
    this.style = this.style + this.inlineStyle;
  }

  // public blockSpecial: RegExp = /^[^<>*!]+$/;

  // public blockSpace: RegExp = /[^\s]/;

  // public ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

  // public cc: string = '';
}
