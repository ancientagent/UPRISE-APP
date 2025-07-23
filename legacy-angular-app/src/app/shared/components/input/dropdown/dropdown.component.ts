import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-dropdown",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit {
  selectedRange: any;

  @Input()
  formGroup!: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() labelName = "name";
  @Input() options: any = [];
  @Input() disable:boolean = false;
  @Input() disabled: boolean = false;
  @Input() showClear: boolean = false;

  @Input() className: string = "";

  @Input() showErrorMessage = true;
  @Input() error = "";
  @Input() emptyFilterMessage = "'band have no albums'";
  @Input() placeholder = "";
  @Input() type = "";
  @Input() inlineStyle = "";
  @Input() filter : boolean = false;
  @Input() filterBy = "";

  @Input() label = "";

  constructor() {}

  ngOnInit(): void {}
}
