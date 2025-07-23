import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";

import { AuthService } from "src/app/api/services/auth.service";
import { BandService } from "src/app/api/services/band.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import { checkPassword, inputValidations , patterntValidations} from "src/app/common/utils";

@Component({
  selector: "app-listener-profile",
  templateUrl: "./listener-profile.component.html",
  styleUrls: ["./listener-profile.component.scss"],
})
export class ListenerProfileComponent implements OnInit {
  private emailExp: string = regularExpressions.emailExp;
  private passwordExp: any = regularExpressions.passwordExp;
  private titleExp: any = regularExpressions.titleExp;
  errorMessageemail: any;
  errorMessagepassword: any;
  errorList: any = "";
  hasError: boolean;
  listenerForm: FormGroup;
  singleFileToUpload: File = null;
  disableSubmit = false;
  imageSrc: any;
  showDefault: boolean = true;
  img: any;
  bandData: any;
  isLoading: boolean = false;
  displayUploadedPic: boolean = false;
  checked: boolean = false;
  profilePic: boolean;
  activeIndex: any;
  activeImage: any;
  clickedImage: any;
  clickedIndex: any;
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private bandService: BandService
  ) {
    this.listenerForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.email,
          Validators.pattern(this.emailExp),
        ],
      ],
      password: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.passwordExp),
        ],
      ],

      confirmpassword: [
        "",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
        ],
      ],
      userName: ["",[Validators.required , Validators.pattern(this.titleExp)]],
    });
  }

  ngOnInit(): void {
    this.bandData = JSON.parse(localStorage.getItem("bandData"));
    this.bandService.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.emailbinding();
  }

  emailbinding() {
    this.listenerForm.controls.email.setValue(this.bandData.email);
  }

  //pattern validation
  inputPatternValidationsErrors = (listenerForm: any, type: any) => {
    return patterntValidations(listenerForm, type);
  };

  //error validations
  inputValidationsErrors = (listenerForm: any, type: any) => {
    return inputValidations(listenerForm, type);
  };

  // passsword error validation
  checkPasswordErrors = (listenerForm, newPass, oldPass): boolean => {
    this.disableSubmit = checkPassword(listenerForm, newPass, oldPass);
    return this.disableSubmit;
  };

  // profile pic upload
  onFileImageupload(event) {
    this.img = event.target.files[0];
    this.displayUploadedPic = true;
    const reader = new FileReader();
    reader.onload = (e) => (this.imageSrc = reader.result);
    reader.readAsDataURL(this.img);
    this.showDefault = false;
  }

  // signup api

  // getFormValue
  getFormValue = (type) => this.listenerForm.get(type).value;
  signUp() {
    const formData = new FormData();
    formData.append("token", localStorage.getItem("InviteToken"));
    formData.append("email", this.getFormValue("email"));
    formData.append("password", this.getFormValue("password"));
    formData.append("userName", this.getFormValue("userName"));

    formData.append("avatarId", this.activeIndex?this.activeIndex:null);
    if(this.checked == true && this.listenerForm.valid == true) {
      this.isLoading = true;
    this.service.createListnerProfile(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.isLoading = false;
      this.listenerForm.reset();
      this.router.navigateByUrl("/profilecreated");
    });}
    else{
      
    }    if (this.listenerForm.valid) {
      const listenerForm = { ...this.listenerForm };
    } else {
      this.hasError = true;
    }
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
  }
  // avatar upload
  profileUpload(){
    this.profilePic=true;
  }
  cancelModel(data){
    this.profilePic=false;
    this.clickedImage = this.activeImage 
    this.clickedIndex = this.activeIndex
  }
  removeavatar(data){
    this.clickedImage = null
    this.clickedIndex = null
  }
  saveModel(data){
    this.activeImage = this.clickedImage
    this.activeIndex = this.clickedIndex    
    this.profilePic=false;
  }
  clickModel(img){
    this.clickedImage = img.url
    this.clickedIndex = img.id
  }
}
