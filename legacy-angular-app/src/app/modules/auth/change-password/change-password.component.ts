import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/api/services/auth.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import {
  changePassword,
  inputValidations,
  patterntValidations
} from "src/app/common/utils";

@Component({
  selector: "app-change-password",
  templateUrl: "./change-password.component.html",
  styleUrls: ["./change-password.component.scss"],
})
export class ChangePasswordComponent implements OnInit {
  private passwordExp: any = regularExpressions.passwordExp;
  disableSubmit = false;
  changepasswordForm: FormGroup;
  errorList: any = "";
  hasError: boolean;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.changepasswordForm = this.fb.group({
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.passwordExp),
        ],
      ],
      confirmpassword: ["", Validators.required],
    });
  }

  ngOnInit(): void {}

  //pattern validation
  inputPatternValidationsErrors = (changepasswordForm: any, type: any) => {
    return patterntValidations(changepasswordForm, type);
  };

  // error validation
  inputValidationsErrors = (changepasswordForm: any, type: any) => {
    return inputValidations(changepasswordForm, type);
  };

  //password validation
  checkPasswordErrors = (changepasswordForm, newPass, confmpass): boolean => {
    this.disableSubmit = changePassword(changepasswordForm, newPass, confmpass);
    return this.disableSubmit;
  };

  // password change method
  changePassword() {
    var currentUrl = window.location.search;
    const params = new URLSearchParams(currentUrl);
    const resetToken = params.get("resetToken");
    let pawdobj = {
      password: this.changepasswordForm.value.confirmpassword,
      token: resetToken,
    };
    this.service.changePassword(pawdobj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.service.signOut();
      this.router.navigateByUrl("/");
    });

    if (this.changepasswordForm.valid) {
      const changepasswordForm = { ...this.changepasswordForm };
    } else {
      this.hasError = true;
    }
  }
}
