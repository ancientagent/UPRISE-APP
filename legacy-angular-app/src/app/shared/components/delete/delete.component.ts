import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {
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
