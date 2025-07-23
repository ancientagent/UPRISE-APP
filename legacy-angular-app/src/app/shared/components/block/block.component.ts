import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['../delete/delete.component.scss']
})
export class BlockComponent implements OnInit {
  @Input() deleteModal = null;
  @Input() name = null;
  @Output() close = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }
  closeModal(){
    this.close.emit();
  }
  ConfirmDelete(){
    this.delete.emit();
  }
}
