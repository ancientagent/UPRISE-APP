import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthguardserviceService {
  constructor() {}
  gettoken() {
    return !!localStorage.getItem("authgurd");
  }
  getsessionend() {
    return !!sessionStorage.getItem("login");
  }
  getremember() {
    return !!localStorage.getItem("remember");
  }
}
