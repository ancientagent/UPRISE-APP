import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/api/services/auth.service";

@Component({
  selector: "app-band-invite-confirm",
  templateUrl: "./band-invite-confirm.component.html",
  styleUrls: ["./band-invite-confirm.component.scss"],
})
export class BandInviteConfirmComponent implements OnInit {
  userData: any;
  bandData: any;
  InviteToken: any;
  currentURL: any;
  errormessage: any;
  showinvitedetails: boolean = false;
  constructor(private authservice: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getBandDetails();
  }

  getBandDetails() {
    var currentUrl = window.location.search;
    const params = new URLSearchParams(currentUrl);
    this.InviteToken = params.get("token");
    localStorage.setItem("InviteToken", this.InviteToken);
    let obj = {
      token: this.InviteToken,
    };
    this.authservice.getBandDetails(obj).subscribe(
      (response) => {
        this.userData = response?.["data"][0];
        localStorage.setItem("listenerData", JSON.stringify(this.userData));
      },
      (errRes: HttpErrorResponse) => {
        this.errormessage = errRes?.error?.error;
      }
    );
  }

  //accept invite
  AcceptInvitation() {
    let obj = {
      token: this.InviteToken,
      status: "ACCEPTED",
    };
    this.authservice.bandInviteVerify(obj).subscribe((res: any) => {
      this.bandData = res.data;
      localStorage.setItem("bandData", JSON.stringify(this.bandData));
      if (this.bandData.newUser == true) {
        this.router.navigate(["/listenerprofile/signup"]);
      } else {
        this.router.navigate(["/band-accepted"]);
      }
    });
  }

  //reject invite
  rejectInvitation() {
    var currentUrl = window.location.search;
    const params = new URLSearchParams(currentUrl);
    this.InviteToken = params.get("token");
    let obj = {
      token: this.InviteToken,
      status: "REJECTED",
    };
    this.authservice.rejectInvitation(obj).subscribe((res: any) => {
      this.userData = res.data;
      this.router.navigate(["/band-denied"]);
    });
  }
}
