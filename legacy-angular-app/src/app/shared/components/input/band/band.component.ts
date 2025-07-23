import { Component, OnInit ,  EventEmitter,
  Input,
  Output,} from '@angular/core';
import { FormGroup } from "@angular/forms";
import { Router } from '@angular/router';


@Component({
  selector: 'app-band-admin',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss']
})
export class BandComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() clearband = "";
  @Input() action = "";
  @Input() bandUsersList = [];
  @Input() error = "";
  @Output() completeMethod = new EventEmitter();
  @Output() onSelect = new EventEmitter();
  currentURL: any;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentURL = this.router?.url;
  }
  bandUsersSelect(event): void {
    this.completeMethod.emit(event);
  }
  onselect(event): void {
    this.onSelect.emit(event);
  }
  clearbandsearch(data){
    this.formGroup.get(data).reset();
  }
}
