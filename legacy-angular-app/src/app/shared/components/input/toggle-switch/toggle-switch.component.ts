import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss']
})
export class ToggleSwitchComponent implements OnInit {
  @Input() value:any;
  @Input() disabled = false;
  @Output() live = new EventEmitter();

  constructor() { }
  ngOnInit(): void {}
  
  lived(event): void {
    this.live.emit(event);
  }
}
