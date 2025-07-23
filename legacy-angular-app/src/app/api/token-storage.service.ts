import { Injectable } from "@angular/core";
import { AuthService } from "./services/auth.service";

@Injectable({
  providedIn: "root",
})
export class TokenStorageService {
  constructor(private service:AuthService) {}

  signOut(): void {
    // window.localStorage.clear();
    this.service.signOut();
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem("accessToken");
    window.localStorage.setItem("accessToken", token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem("accessToken");
  }

  public saveRefreshToken(token: string): void {
    window.localStorage.removeItem("refreshToken");
    window.localStorage.setItem("refreshToken", token);
  }

  public getRefreshToken(): string | null {
    return window.localStorage.getItem("refreshToken");
  }
}
