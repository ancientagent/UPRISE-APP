import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";

import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private baseUrl: string = environment.API_URL;
  private client_id: any = environment.CLIENT_ID;
  private client_secret = environment.CLIENT_SECRET;

  constructor(private http: HttpClient, private router: Router) {}
  registerError = new EventEmitter<any>();

  headers() {
    let headers = new HttpHeaders();
    headers = headers

      .set("client-id", this.client_id)
      .set("client-secret", this.client_secret);
    return headers;
  }

  //sign in
  signIn(data: any) {
    return this.http.post(this.baseUrl + "auth/login", data, {
      headers: this.headers(),
    });
  }

  //sign up
  signUp(data: any) {
    return this.http.post(this.baseUrl + "auth/signup", data, {
      headers: this.headers(),
    });
  }

  signOut(): void {
    let remember = localStorage.getItem('remember')
      let email = localStorage.getItem('email')
      let password = localStorage.getItem('token')
      localStorage.clear();
      localStorage.setItem('remember',remember)
      localStorage.setItem('email',email)
      localStorage.setItem('token',password)
  }
  //forgot password
  forgotPassword(data: any) {
    return this.http.post(this.baseUrl + "auth/request-reset-password", data, {
      headers: this.headers(),
    });
  }

  // reset password
  changePassword(data: any) {
    return this.http.post(this.baseUrl + "auth/reset-password", data, {
      headers: this.headers(),
    });
  }

  //refresh token

  getRefreshToken() {
    const refreshToken = localStorage.getItem("refreshToken");
    let headers = new HttpHeaders();
    headers = headers

      .set("client-id", this.client_id)
      .set("client-secret", this.client_secret)
      .set("x-refresh-token", refreshToken);
    return this.http.post(this.baseUrl + "auth/generate-tokens", {
      headers: headers,
    });
  }

  //get band details
  getBandDetails(data: any) {
    return this.http.post(this.baseUrl + "auth/band_details", data, {
      headers: this.headers(),
    });
  }
  //band invite verify
  bandInviteVerify(data: any) {
    return this.http.post(this.baseUrl + "auth/verify_bandmember", data, {
      headers: this.headers(),
    });
  }

  //reject invitation
  rejectInvitation(data: any) {
    return this.http.post(this.baseUrl + "auth/bandmember_reject", data, {
      headers: this.headers(),
    });
  }

  //listner profile
  createListnerProfile(data: any) {
    return this.http.post(this.baseUrl + "auth/bandmember_signup", data, {
      headers: this.headers(),
    });
  }

  //auto refresh
  autoRefresh() {
    return this.http.get(this.baseUrl + "user/me", {
      headers: this.headers(),
    });
  }
  // register mail verification
  status(token){
    return this.http.post(this.baseUrl + "auth/status",{token:token},{headers: this.headers(),})
  }
}
