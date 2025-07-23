import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "src/app/api/services/auth.service";
import { BandService } from "src/app/api/services/band.service";
import { changeOldPassword, inputValidations } from "src/app/common/utils";
import { ToastrService } from "ngx-toastr";
import { changePassword } from "src/app/common/utils";
import { regularExpressions } from "src/app/common/regularexpressions";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
  private passwordExp: any = regularExpressions.passwordExp;
  name: any;
  avatar: any;
  avatarimg: any;
  changepwdform: FormGroup;
  changepwdModal: boolean = false;
  disableSubmit = false;
  hasError: boolean;
  user:any
  bands:[];
  selectedband:any;

  errorList: any = "";
  userData: any;
  disableoldSubmit: boolean;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastrService: ToastrService,
    private service: BandService,
    private auth:AuthService
  ) {
    this.changepwdform = this.fb.group({
      oldpwd: ["", Validators.required],
      newpwd: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.passwordExp),
        ],
      ],
      cnewpwd: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.bands = JSON.parse(localStorage.getItem("bands"));
    this.userData = JSON.parse(localStorage.getItem("user"));


    setTimeout(() => {
      if(this.bands.length>0){
      this.selectedband = JSON.parse(localStorage.getItem("band"));
    }
    }, 0);
    // this.name = user.userName;
    // this.avatarimg = user.avatar;
    // if (this.avatarimg == null) {
    //   this.avatar = "assets/images/profilepic2.png";
    // } else {
    //   this.avatar = user.avatar;
    // }
    this.getuserdata();
  }
  logout() {
    this.auth.signOut();
    sessionStorage.clear();
    this.toastrService.success("You have been Logged out");
    this.router.navigateByUrl("/");
  }

  // get user data
  getuserdata(){
    this.auth.autoRefresh().subscribe((res:any)=>{
      this.user = res.data
    this.name = this.user.userName;
    this.avatarimg = this.user.avatar;
    this.avatar = this.avatarimg?this.avatarimg:"assets/images/profilepic2.png";
    // if (this.avatarimg == null) {
    //   this.avatar = "assets/images/profilepic2.png";
    // } else {
    //   this.avatar = this.user.avatar;
    // }
    })
  }
  //error validations
  inputValidationsErrors = (loginForm: any, type: any) => {
    return inputValidations(loginForm, type);
  };
  //password validation
  checkPasswordErrors = (changepwdform, newPass, confmpass): boolean => {
    this.disableSubmit = changePassword(changepwdform, newPass, confmpass);
    return this.disableSubmit;
  };
  //password validation
  checkOldPasswordErrors = (changepwdform,   oldpassword, newpassword): boolean => {
    this.disableoldSubmit = changeOldPassword(changepwdform,oldpassword, newpassword);
    return this.disableoldSubmit;
  };
  //pattern validation
  inputPatternValidationsErrors = (changepwdform: any, type: any) => {
    return this.patterntValidations(changepwdform, type);
  };
  //pattern validation
  patterntValidations = (changepwdform: any, type: any) => {
    return (
      (changepwdform.get(type).touched || changepwdform.get(type).dirty) &&
      changepwdform.get(type).errors !== null &&
      changepwdform.get(type).errors.pattern
    );
  };
  //profile navigation
  profile() {
    this.router.navigateByUrl("/band/profile");
  }
  // change password
  changepwdModalOpen() {
    this.changepwdform.reset();
    this.changepwdModal = true;
  }
  changepwdModalClose() {
    this.changepwdModal = false;
    this.changepwdform.reset();
  }
  changepwd() {
    let changepwdobj = {
      currentPassword: this.changepwdform.value.oldpwd,
      password: this.changepwdform.value.newpwd,
    };
    this.service.changePassword(changepwdobj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.changepwdModal = false;
    });
    if (this.changepwdform.valid) {
      const changepwdform = { ...this.changepwdform };
    } else {
      this.hasError = true;
    }
  }
  bandchange(data){
    localStorage.setItem("band", JSON.stringify(data.value));
    setTimeout(() => {
      window.location.reload();
    }, 0);
  }
}
