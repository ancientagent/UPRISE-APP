import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Router } from "@angular/router";
import { of, Subscription, timer } from "rxjs";

import { AuthService } from "src/app/api/services/auth.service";

@Component({
  selector: "app-band",
  templateUrl: "./band.component.html",
  styleUrls: ["./band.component.scss"],
})
export class BandComponent implements OnInit {
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
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("band", JSON.stringify(res.data.bands[0]));
    });
  }
}
