import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/api/services/auth.service";
import { BandService } from "src/app/api/services/band.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import { NgxSpinnerService } from "ngx-spinner";

import {
  inputValidations,
  patterntValidations
} from "src/app/common/utils";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  private emailExp: string = regularExpressions.emailExp;
  private passwordExp: any = regularExpressions.passwordExp;
  private titleExp: any = regularExpressions.titleExp;
  errorList: any = "";
  hasError: boolean;
  img: any;
  displayUploadedPic: boolean = false;
  imageSrc: any;
  showDefault: boolean = true;
  profileForm: FormGroup;
  userData: any;
  avatar: any;
  isLoading: boolean = false;
  heading: string = "Profile";
  editDisable: boolean = false;
  band: any;
  profilePic: boolean;
  activeIndex: any;
  activeImage: any;
  clickedImage: any;
  clickedIndex: any;
  constructor(
    private fb: FormBuilder,
    private service: BandService,
    private toastrService: ToastrService,
    private auth:AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.profileForm = this.fb.group({
      email: ["",[Validators.required,Validators.email,Validators.pattern(this.emailExp),],],
      userName: ["",[Validators.required , Validators.pattern(this.titleExp)]],
      mobileno: [""],
      twitter:[''],
      facebook:[''],
      instagram:[''],
    });
  }
  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.activeImage=this.userData.avatar
    this.activeIndex=this.userData.avatarId
    if(this.userData.role.name != "admin"){
      this.band = JSON.parse(localStorage.getItem("band"));
    }
    this.getuserdata();
    this.service.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
  }

  getuserdata(){
    this.spinner.show();
    this.auth.autoRefresh().subscribe((res:any)=>{
      this.userData = res.data;
      this.loadData();
      this.spinner.hide();
    })
  }
  // input number validation
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //pattern validation
  inputPatternValidationsErrors = (profileForm: any, type: any) => {
    return patterntValidations(profileForm, type);
  };

  //error validations
  inputValidationsErrors = (profileForm: any, type: any) => {
    return inputValidations(profileForm, type);
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

  //loadData
  loadData() {
    this.profileForm.patchValue({
      email: this.userData.email,
      userName: this.userData.userName,
      mobileno: this.userData.mobile,
      twitter: this.userData.twitter,
      instagram: this.userData.instagram,
      facebook: this.userData.facebook,
    });

    if (this?.userData?.avatar == null) {
      this.avatar = "assets/images/profilepic2.png";
    } else {
      this.avatar = this.userData.avatar;
    }
  }

  getFormValue = (type) => this.profileForm.get(type).value;
  
  //update user
  UpdateUser() {
    if (this.profileForm.valid) {
      const profileForm = { ...this.profileForm };
      this.isLoading = true;
    } else {
      this.hasError = true;
    }
    this.isLoading = true;

    const formData = new FormData();
    formData.append("email", this.profileForm.value.email);
    formData.append("userId", this.userData.id);
    formData.append(
      "userName",
      this.profileForm.value.userName ? this.profileForm.value.userName : ""
    );
    formData.append(
      "mobile",
      this.profileForm.value.mobileno ? this.profileForm.value.mobileno : ""
    );
    formData.append(
      "twitter",
      this.profileForm.value.twitter ? this.profileForm.value.twitter : ""
    );
    formData.append(
      "instagram",
      this.profileForm.value.instagram ? this.profileForm.value.instagram : ""
    );
    formData.append(
      "facebook",
      this.profileForm.value.facebook ? this.profileForm.value.facebook : ""
    );
    formData.append("avatarId", this.activeIndex ? this.activeIndex : null);
    this.service.updateUserProfile(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      localStorage.removeItem("user");
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => {
        window.location.reload();
      }, 400);
      this.isLoading = false;
      // this.heading = "Profile"
      // this.editDisable = false
    });
  }
  //button loader
  buttonLoading() {
    this.isLoading = false;
  }
  edit() {
    this.heading = "Edit Profile";
    this.editDisable = true;
    this.activeImage=this.userData.avatar
    this.activeIndex=this.userData.avatarId
    this.clickedImage = this.userData.avatar
    this.clickedIndex = this.userData.avatarId
  }
  cancel() {
    this.heading = "Profile";
    this.editDisable = false;
    this.loadData();
  }

  // profile pic upload
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
