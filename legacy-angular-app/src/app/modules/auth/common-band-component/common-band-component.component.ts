import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "src/app/api/services/auth.service";

@Component({
  selector: "app-common-band-component",
  templateUrl: "./common-band-component.component.html",
  styleUrls: ["./common-band-component.component.scss"],
})
export class CommonBandComponentComponent implements OnInit {
  confirmModal: boolean = false;
  userData: any;
  bandData: any;
  InviteToken: any;
  currentURL: any;
  showinvitedetails: boolean = false;
  constructor(private authservice: AuthService, private router: Router) {
    this.currentURL = this.router?.url;
    this.userData = JSON.parse(localStorage.getItem("listenerData"));
  }

  ngOnInit(): void {}
  login(){
    this.authservice.signOut();
    this.router.navigateByUrl("/");
  }
  loginmessage(){
    this.authservice.signOut();
    this.router.navigateByUrl("/login-message");
  }
}
