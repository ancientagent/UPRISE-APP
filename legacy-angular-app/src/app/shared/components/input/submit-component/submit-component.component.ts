import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  EventEmitter,
  Output,
} from "@angular/core";
@Component({
  selector: "app-submit-component",
  templateUrl: "./submit-component.component.html",
  styleUrls: ["./submit-component.component.scss"],
})
export class SubmitComponentComponent implements OnInit {
  @Input() type: string = "";
  @Input() class: string = "";
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() icon: string = "";
  @Input() label: string = "";
  @Input() message: string = "";
  @Input() ifHasError: boolean = false;
  @Input() showIcon: boolean = false;
  @Output() submitForm = new EventEmitter<any>();
  @Input() inlineStyle = "";
  style: string =
    "  background: #906dd5;border: 0.6px solid #906dd5;width: 100px;color: #ffffff;box-sizing: border-box;border-radius: 40px;";
  constructor() {}
  ngOnInit(): void {
    this.style = this.style + this.inlineStyle;
  }
  onSubmit(): void {
    this.submitForm.emit();
  }
}
