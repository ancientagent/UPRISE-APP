import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/api/services/auth.service";
import { BandService } from "src/app/api/services/band.service";
import { TokenStorageService } from "src/app/api/token-storage.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import { inputValidations , patterntValidations} from "src/app/common/utils";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  private emailExp: string = regularExpressions.emailExp;
  private passwordExp: any = regularExpressions.passwordExp;
  errorMessageemail: any;
  errorMessagepassword: any;
  errorList: any = "";
  hasError: boolean;
  isLoading = false;
  userData: any;
  loginForm: FormGroup;
  checked: boolean = false;
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private bandService: BandService,
    private tokenStorage: TokenStorageService
  ) {
    this.loginForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          // Validators.email,
          // Validators.pattern(this.emailExp),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      remberme: [""],
    });
  }

  ngOnInit(): void {
    this.bandService.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    let remember = localStorage.getItem("remember")    
    if(remember=='true'){
      let email = localStorage.getItem("email")
      let password = localStorage.getItem("token")
      this.loginForm.patchValue({
        email:email,
        password:window.atob(password),
        remberme:remember
      })
      this.checked=remember=="true"?true:false
    }
    else{
      this.loginForm.patchValue({
        email:"",
        password:"",
        remberme:false
      })
      this.checked=false
    }
    var loginTime = JSON.parse(localStorage.getItem("login-time"))
    if(JSON.parse(localStorage.getItem("remember"))){
      if(((new Date(Date.now() - (7*24*60* 60 *1000)))  < (new Date(loginTime)))){
        this.userData = JSON.parse(localStorage.getItem("user"));
        if (this.userData?.role?.name === "admin") {
          this.router.navigateByUrl("/admin");
        } else if (this.userData?.role?.name === "artist" || this.userData?.role?.name === "listener") {
          this.router.navigateByUrl("/band");
        }
      }
      else{
        this.router.navigateByUrl("");
      }
    }
    else{
      if(((new Date(Date.now() - (60* 60 *1000)))  < (new Date(loginTime)) )){
        this.userData = JSON.parse(localStorage.getItem("user"));
        if (this.userData?.role?.name === "admin") {
          this.router.navigateByUrl("/admin");
        } else if (this.userData?.role?.name === "artist" || this.userData?.role?.name === "listener") {
          this.router.navigateByUrl("/band");
        }
      }
      else{
        this.router.navigateByUrl("");
      }
    }
  }

  //pattern validation
  inputPatternValidationsErrors = (loginForm: any, type: any) => {
    return patterntValidations(loginForm, type);
  };

  //error validations
  inputValidationsErrors = (loginForm: any, type: any) => {
    return inputValidations(loginForm, type);
  };

  //login function

  login() {
    let loginobj = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.service.signIn(loginobj).subscribe((res: any) => {
      this.userData = res.data.user;
      // this.tokenStorage.saveToken( res.data.accessToken));
      // this.tokenStorage.saveRefreshToken(res.data.refreshToken);
      this.tokenStorage.saveToken(res.data.accessToken);
      this.tokenStorage.saveRefreshToken(res.data.refreshToken);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("authgurd", "true");
      localStorage.setItem('remember',JSON.stringify(this.checked))
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("band", JSON.stringify(res.data.user.bands[0]));
      localStorage.setItem("bands", JSON.stringify(res.data.user.bands));
      localStorage.setItem("login-time", JSON.stringify(new Date));
      sessionStorage.setItem('login','true')
      this.isLoading = false;
      if(this.checked){
        localStorage.setItem("email", loginobj.email);
        localStorage.setItem("token", window.btoa(loginobj.password));
      }
      // if (this.userData.role.name === "listener") {
      //   this.toastrService.warning("please login in mobile app");
      // } else {
      // }

      if (this.userData.role.name === "admin") {
        this.router.navigateByUrl("/admin");
        this.toastrService.success(res.message);
      } else if ((this.userData.role.name === "artist" || this.userData.role.name === "listener") && this.userData.bands.length > 0) {
        this.router.navigateByUrl("/band");
        this.toastrService.success(res.message);
      }
      else if(this.userData.bands.length == 0){
        this.service.signOut();
        this.router.navigateByUrl("/dashboard-fallback");
      }
    });

    if (this.loginForm.valid) {
      const loginForm = { ...this.loginForm };
      this.isLoading = true;
    } else {
      this.hasError = true;
    }
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
  }
}
