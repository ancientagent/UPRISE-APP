import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthguardserviceService } from "./services/authguardservice.service";

@Injectable({
  providedIn: "root",
})
export class AuthenticationGuard implements CanActivate {
  remember:any
  session: any;
  logintime: any;
  constructor(
    private Authguardservice: AuthguardserviceService,
    private router: Router
  ) {}
  canActivate(): boolean {
    this.remember = JSON.parse(localStorage.getItem("remember"))
    this.session = JSON.parse(sessionStorage.getItem("login"))  
    this.logintime = JSON.parse(localStorage.getItem("login-time"))  
    // if (!this.Authguardservice.gettoken() || (!this.remember && !this.session)) {
    //   this.router.navigate(["/signIn"]);7 * 24 * 60 * 60 * 1000
    // }
    if (!this.Authguardservice.gettoken() || (!this.session && ((!this.remember && ((new Date(Date.now() - (60* 60 *1000))) > (new Date(this.logintime)))) || (this.remember && ((new Date(Date.now() - (7*24*60* 60 * 1000))) > (new Date(this.logintime))))) )) {
      this.router.navigate(["/signIn"]);
    }
    return this.Authguardservice.gettoken();
  }
}
