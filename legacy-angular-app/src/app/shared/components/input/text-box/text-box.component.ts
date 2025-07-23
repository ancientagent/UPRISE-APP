import { Component, OnInit, ViewEncapsulation, Input } from "@angular/core";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "app-text-box",
  templateUrl: "./text-box.component.html",
  styleUrls: ["./text-box.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class TextBoxComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() disabled: boolean;
  @Input() maxlength: number | string = "";
  @Input() showErrorMessage = true;
  @Input() error = "";
  @Input() placeholder = "";
  @Input() type = "";

  @Input() label = "";
  @Input() className = "";
  @Input() min: any;
  @Input() max: any;
  @Input() inlineStyle = "";
  style: string =
    "  background: #0f0f0f;border: 0.6px solid rgba(240, 240, 240, 0.3);width: 100%;color: #fff;box-sizing: border-box;border-radius: 2px; padding-left: 10px !important;";
  constructor() {}
  ngOnInit(): void {
    this.style = this.style + this.inlineStyle;
  }

  // stop white spaces
  isWhiteSpace(char): boolean {
    return (/\s/).test(char);
  }
  willCreateWhitespaceSequence(evt): boolean {
    var willCreateWSS = false;
    if (this.isWhiteSpace(evt.key)) {
      var elmInput = evt.currentTarget;
      var content = elmInput.value;
  
      var posStart = elmInput.selectionStart;
      var posEnd = elmInput.selectionEnd;
      willCreateWSS = (
           this.isWhiteSpace(content[posStart - 1] || '')
        || this.isWhiteSpace(content[posEnd] || '')
      );
    }
    return willCreateWSS;
  }

  isAlfa(evt:any): boolean {
    return (this.willCreateWhitespaceSequence(evt)) ? false : true;
  }
  // public blockSpecial: RegExp = /^[^<>*!]+$/;

  // public blockSpace: RegExp = /[^\s]/;

  // public ccRegex: RegExp = /[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}$/;

  // public cc: string = '';
}
