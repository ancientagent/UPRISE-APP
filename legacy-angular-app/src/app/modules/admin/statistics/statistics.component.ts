import { Component, OnInit, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/api/services/admin.service';
import { NgxSpinnerService } from "ngx-spinner";
import { Paginator } from 'primeng/paginator';
import { SortEvent } from 'primeng/api';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent implements OnInit {
  @ViewChild('statasticsPaginator') statasticsPaginator: Paginator;
  enteredEmail: any;
  clearband: boolean = false;
  bandUsersList: any;
  bandenter:any = '';
  statastics:any=[];
  pageData: any;
  totalrecords: number;
  sortingOrder:string;
  sort:string;

  constructor(private adminservice: AdminService,private spinner: NgxSpinnerService,) {

   }

  ngOnInit(): void {
    this.paginate({page:0,rows:10});
  }
  
  // songs pagination
  paginate(event) {
    this.spinner.show();
    let obj = {
      currentPage: event.page + 1,
      perPage: event.rows,
      bandId:this.bandenter.id,
      upvotes:this.sort=='upvotes'?this.sortingOrder:null,
      downvotes:this.sort=='downvotes'?this.sortingOrder:null,
      blasts:this.sort=='blasts'?this.sortingOrder:null
    };
    if(this.sort == null){
      obj.upvotes = "DESC"
    }
    this.adminservice.getStatastics(obj).subscribe((res:any)=>{
      this.statastics=res.data.songs
      this.totalrecords = this.statastics[0]?.totalCount;
      this.pageData = res.data.metadata;
      this.spinner.hide();
    });
  }
  bandUsersSelect(event) {
    this.clearband=false
    this.enteredEmail = event.query;
    this.adminservice.bandUsersSelect({input: event.query}).subscribe((res: any) => {
      this.bandUsersList = res.data;
      this.clearband=true
    });
  }
  onselect(event){
    this.paginate({page:0,rows:this.pageData.perPage});
    this.statasticsPaginator?.changePage(0);
  }
  clearbandsearch(){
    this.bandenter=''
    this.paginate({page:0,rows:this.pageData.perPage});
    this.statasticsPaginator?.changePage(0);
  }
  customSort(event: SortEvent) {
    if((this.sortingOrder == (event.order == -1?'DESC':'ASC'))&&(this.sort==event.field)){

    }
    else{
    console.log(event.field,event.order);
    if(event.order == 1){
      this.sortingOrder = 'ASC'
    }
    else if(event.order == -1){
      this.sortingOrder = 'DESC'
    }
    else{
      this.sortingOrder = null
    }
    this.sort=event.field||'upvotes'
    this.paginate({page:0,rows:this.pageData?.perPage});
    this.statasticsPaginator?.changePage(0);
  }
}
}
