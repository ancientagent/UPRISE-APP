import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/api/services/auth.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import { inputValidations, patterntValidations } from "src/app/common/utils";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  private emailExp: string = regularExpressions.emailExp;
  forgotForm: FormGroup;
  errorList: any = "";
  hasError: boolean;
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastrService: ToastrService
  ) {
    this.forgotForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailExp),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  //pattern validation
  inputPatternValidationsErrors = (forgotForm: any, type: any) => {
    return patterntValidations(forgotForm, type);
  };
  //error validations
  inputValidationsErrors = (forgotForm: any, type: any) => {
    return inputValidations(forgotForm, type);
  };

  //forgot function
  forgotPassword() {
    let forgotnobj = {
      email: this.forgotForm.value.email,
    };
    if (this.forgotForm.valid) {
      const forgotForm = { ...this.forgotForm };
      this.service.forgotPassword(forgotnobj).subscribe((res: any) => {
        this.toastrService.success(res.message);
      });
    } else {
      this.hasError = true;
    }
  }
}
