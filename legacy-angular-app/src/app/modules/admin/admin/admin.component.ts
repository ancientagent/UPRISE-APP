import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Subscription, timer } from "rxjs";
import { AuthService } from "src/app/api/services/auth.service";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"],
})
export class AdminComponent implements OnInit {
  subscription: Subscription;
  title = "webappui";
  userData: any;

  constructor(private authservice: AuthService, private http: HttpClient) {}
  ngOnInit() {
    this.subscription = timer(0, 60 * 1000).subscribe(() => {
      this.autoRefresh();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  //auto refresh
  autoRefresh() {
    this.authservice.autoRefresh().subscribe((res: any) => {
    });
  }
}
