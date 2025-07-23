import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-check-box",
  templateUrl: "./check-box.component.html",
  styleUrls: ["./check-box.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CheckBoxComponent implements OnInit {
  @Input()
  formGroup: FormGroup;
  @Input() class = "";
  @Input() name = "";
  @Input() value: any;
  @Input() disabled: boolean;

  @Input() label = "";
  @Input() className = "";

  constructor() {}
  ngOnInit(): void {}
}
