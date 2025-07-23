import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "webappui";
  userData: any;

  constructor(private router: Router) {
    window.addEventListener("storage", (event) => {
      if (event.storageArea == localStorage) {
        let token = localStorage.getItem("accessToken");
        if (token == undefined) {
          this.router.navigate(["/"]);
        }
        this.userData = JSON.parse(localStorage.getItem("user"));
        if (this.userData?.role?.name === "admin") {
          this.router.navigateByUrl("/admin");
        } else if (this.userData?.role?.name === "artist" || this.userData?.role?.name === "listener") {
          this.router.navigateByUrl("/band");
        }
      }
    });
  }
}
