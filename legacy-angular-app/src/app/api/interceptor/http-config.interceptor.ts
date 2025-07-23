import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import {
  Observable,
  of,
  throwError,
  retryWhen,
  concatMap,
  delay,
  BehaviorSubject,
} from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthService } from "../services/auth.service";
import { BandService } from "../services/band.service";
import { TokenStorageService } from "../token-storage.service";

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );
  private clientId: any = environment.CLIENT_ID;
  private clientsecret = environment.CLIENT_SECRET;

  errormsg: any;
  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private authservice: AuthService,
    private bandservice: BandService,
    private tokenService: TokenStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<Object>> {
    const token = this.tokenService.getToken();

    if (token != null) {
      req = this.addTokenHeader(req, token);
    }
    const refreshToken = this.tokenService.getRefreshToken();
    const hasRefreshToken = req.url.includes("generate-tokens");
    const hasLocation = req.url.includes("place/autocomplete");

    if (hasLocation == true) {
      req = req.clone({
        headers: req.headers,
      });
    } else {
    }

    if (hasRefreshToken == true) {
      req = req.clone({
        headers: req.headers
          .set("client-id", this.clientId)
          .set("client-secret", this.clientsecret)
          .set("x-refresh-token", refreshToken),
      });
    } else {
    }

    if (hasRefreshToken == false && hasLocation == false) {
      req = this.addTokenHeader(req, token);
    } else {
    }

    return next.handle(req).pipe(
      // retryWhen(error =>
      //   error.pipe(
      //     concatMap((error, count) => {
      //       if (count <= 2 && error.status == 401) {
      //         localStorage.removeItem("accessToken");
      //         this.authservice.getRefreshToken().subscribe((res: any) => {
      //           localStorage.removeItem("refreshToken");
      //           localStorage.setItem("accessToken", res.accessToken);
      //           localStorage.setItem("refreshToken", res.refreshToken);
      //           req = req.clone({
      //             setHeaders: {
      //               "Authorization": `Bearer ${res.accessToken}`,
      //             },
      //           });
      //           return next.handle(req);
      //         });
      //         return of(error);
      //       }
      //       return throwError(error);
      //     }),
      //     delay(1000)
      //   )
      // ),
      catchError((error: HttpErrorResponse) => {
        this.errormsg = error?.error?.error;
        this.authservice.registerError.emit(error.url.includes("auth/status"));
        this.bandservice.liveError.emit(error.url.includes("song/live"));
        this.bandservice.buttonloader.emit(true);
        if (!this.errormsg) {
          // this.toastrService.error("Something went wrong");
        }

        if (
          this.errormsg == "you dont have Access token" ||
          this.errormsg == "user not found" ||
          this.errormsg == "Invalid token" ||
          !this.errormsg
        ) {
        } else {
          this.toastrService.error(this.errormsg);
        }

        if (error.status == 401) {
          return this.handle401Error(req, next);
          // this.authservice.getRefreshToken().subscribe((res: any) => {
          //   localStorage.removeItem("accessToken");
          //   localStorage.removeItem("refreshToken");
          //   localStorage.setItem("accessToken", res.accessToken);
          //   localStorage.setItem("refreshToken", res.refreshToken);
          // });
        }

        if (error.status == 403) {
          // this.toastrService.warning("Your session expired please login again");
          if(error.error.message){
          this.toastrService.error(error.error.message);
        }
        this.authservice.signOut();
        this.router.navigateByUrl("/");
        }

        this.spinner.hide();

        return throwError(error);
      })
    );
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const token = this.tokenService.getRefreshToken();

      if (token)
        return this.authservice.getRefreshToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.tokenService.saveToken(token.accessToken);
            this.tokenService.saveRefreshToken(token.refreshToken);
            this.refreshTokenSubject.next(token.accessToken);

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.tokenService.signOut();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }

  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone({
      headers: request.headers
        .set("client-id", this.clientId)
        .set("client-secret", this.clientsecret)
        .set("Authorization", "Bearer " + token),
    });
  }
}
