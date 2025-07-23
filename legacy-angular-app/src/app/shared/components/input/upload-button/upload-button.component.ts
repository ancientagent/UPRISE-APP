import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.scss']
})
export class UploadButtonComponent implements OnInit {
  @Input() name:any;
  @Input() for:any;


  constructor() { }

  ngOnInit(): void {
  }

}
