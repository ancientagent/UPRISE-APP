import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/api/services/auth.service";
import { of, Subscription, timer } from "rxjs";


@Component({
  selector: "app-sidenav",
  templateUrl: "./sidenav.component.html",
  styleUrls: ["./sidenav.component.scss"],
})
export class SidenavComponent implements OnInit {
  subscription: Subscription;
  urls = [];
  user: any;
  role: any;
  band: any = false;
  constructor(
    private auth : AuthService
  ) {}

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("user"))
    // this.getuserdata();
    if (this?.user?.role?.name === "artist" || this?.user?.role?.name === "listener" ) {
      this.band = JSON.parse(localStorage.getItem("band"))
      this.subscription = timer(0, 60 * 1000).subscribe(() => {
        this.band = JSON?.parse(localStorage?.getItem("band"))
      if(this?.band?.promosEnabled === true){
        this.urls =[
          {
            name: "/band/songsmanagement",
            value: "Songs Management",
            icon: "music",
          },
          {
            name: "/band/event",
            value: "Event Management",
            icon: "pi pi-calendar-minus",
          },
          {
            name: "/band/banddetails",
            value: "Band Profile ",
            icon: "fa fa-users",
          },
          {
            name: "/band/ads-management",
            value: "Ads Management",
            icon: "fas fa-bullhorn",
          },
        ]
      }
      else if( this?.band?.promosEnabled === false ){
        this.urls=[
          {
            name: "/band/songsmanagement",
            value: "Songs Management",
            icon: "music",
          },
          {
            name: "/band/event",
            value: "Event Management",
            icon: "pi pi-calendar-minus",
          },
          {
            name: "/band/banddetails",
            value: "Band Profile ",
            icon: "pi pi-users",
          }
        ]
      }
    });
    } else if (this?.user?.role?.name === "admin") {
      this.urls.push(
        {
          name: "/admin/user-management",
          value: "User Management ",
          icon: "pi pi-user",
        },
        {
          name: "/admin/ads-management",
          value: "Ads Management",
          icon: "fas fa-bullhorn",
        },
        {
          name: "/admin/event",
          value: "Event Management",
          icon: "pi pi-calendar-minus",
        },
        {
          name: "/admin/content-management",
          value: "Content Management ",
          icon: "music",
        },
        {
          name: "/admin/statistics",
          value: "Statistics ",
          icon: "fa fa-line-chart",
        }
      );
  }
  // getuserdata(){
  //   this.auth.autoRefresh().subscribe((res:any)=>{
  //     // this.user = res.data

  //   }
  //   })
  }
}
