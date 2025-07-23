import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BandService } from 'src/app/api/services/band.service';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  @Input() avatarId = null;
  @Input() avatar = null;
  @Input() clickedImage = null;
  @Input() clickedIndex = null;
  @Output() cancelModel = new EventEmitter<any>();
  @Output() removeModel = new EventEmitter<any>();
  @Output() saveModel = new EventEmitter<any>();
  @Output() clickModel = new EventEmitter<any>();
  avatars: any;


  constructor(
   private bandService:BandService
  ) { 
  }

  ngOnInit(): void { 
    this.bandService.avatars().subscribe((res)=>{
      this.avatars = res['data'];
    })    
  }
  imageClick(img) {
    this.clickModel.emit(img);
  }
  saveprofilepic(){
    this.saveModel.emit();
  }
  cancelprofilepic(){
    this.cancelModel.emit();
  }
  removeprofilepic(){
    this.removeModel.emit();
  }
}
