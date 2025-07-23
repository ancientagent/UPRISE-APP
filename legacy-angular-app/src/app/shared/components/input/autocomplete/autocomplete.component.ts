import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.scss"],
})
export class AutocompleteComponent implements OnInit {
  addressInput: ElementRef;
  @Input() label = "";
  @Input() name = "";
  @Input() formGroup: FormGroup;
  @Input() options: any[] = [];
  @Input() error = "";
  @Input() placeholder = "";
  @Input() icon:boolean = false;
  // @Input() showErrorMessage = true;
  // @Input() forceSelection = false;
  // @Input() displayField = "";
  // @Input() searchField = "";
  // @Input() minLength: any;
  // @Input() results: any[] = [];
  @Output() searchEvent = new EventEmitter();
  @Output() selectEvent = new EventEmitter();
  // @Input() inlineStyle = "";
  style: string =
    "  background: #0f0f0f;border: 0.6px solid rgba(240, 240, 240, 0.3);width: 100%;color: #ffffff;box-sizing: border-box;border-radius: 2px;padding-left: 1.7rem;";
  constructor() {}

  ngOnInit(): void {
    // this.style = this.style + this.inlineStyle;
  }

  // search(event): void {
  //   this.searchEvent.emit(event.query);
  // }

  // onSelect(value): void {
  //   this.selectEvent.emit(value);
  // }

  AddressChange(event): void {
    this.searchEvent.emit(event);
  }

  address(event): void {
    this.selectEvent.emit(event);
  }
  clearbandsearch(){
    this.formGroup.get(this.name).reset();
  }
}
