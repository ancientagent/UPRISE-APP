import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/api/services/auth.service";
import { checklocation, checkPassword, inputValidations ,patterntValidations} from "src/app/common/utils";
import { FileUpload } from "primeng/fileupload";
import { BandService } from "src/app/api/services/band.service";
import { regularExpressions } from "src/app/common/regularexpressions";
import { Address } from "ngx-google-places-autocomplete/objects/address";
@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  private emailExp: any = regularExpressions.emailExp;
  private passwordExp: any = regularExpressions.passwordExp;
  private titleExp: any = regularExpressions.titleExp;
  errorMessageemail: any;
  errorMessagepassword: any;
  errorList: any = "";
  hasError: boolean;
  signupForm: FormGroup;
  singleFileToUpload: File = null;
  disableSubmit = false;
  imageSrc: any;
  showDefault: boolean = true;
  img: any;
  checked: boolean = false;
  isLoading: boolean = false;
  displayUploadedPic: boolean = false;
  profilePic:boolean=false;
  activeIndex: any;
  activeImage: any;
  clickedImage: any;
  clickedIndex: any;
  userData: any;
  formattedaddress: string;
  typedaddress: string;
  latitude: any;
  longitude: any;
  disablelocationSubmit: any;
  signupAddress: { country: any; zipcode: any; state: any; city: any; street: any; };
  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private toastrService: ToastrService,
    private router: Router,
    private bandService: BandService,
  ) {
    this.signupForm = this.fb.group({
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
      userName: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      bandName: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      mobileno: [""],
      location: ["", Validators.required],
      role: ["artist", Validators.required],
    });
  }

  ngOnInit(): void {
    this.bandService.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.service.signOut();
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
  inputPatternValidationsErrors = (signupForm: any, type: any) => {
    return patterntValidations(signupForm, type);
  };

  //error validations
  inputValidationsErrors = (signupForm: any, type: any) => {
    return inputValidations(signupForm, type);
  };

  // passsword error validation
  checkPasswordErrors = (signupForm, newPass, oldPass): boolean => {
    this.disableSubmit = checkPassword(signupForm, newPass, oldPass);
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
  getFormValue = (type) => this.signupForm.get(type).value;
  signUp() {
    const formData = new FormData();
    formData.append("email", this.getFormValue("email"));
    formData.append("password", this.getFormValue("password"));
    formData.append("userName", this.getFormValue("userName"));
    formData.append("title", this.getFormValue("bandName"));
    formData.append("mobile", this.getFormValue("mobileno"));
    formData.append("street", this.signupAddress.street);
    formData.append("city", this.signupAddress.city);
    formData.append("state", this.signupAddress.state);
    formData.append("country", this.signupAddress.country);
    if(this.signupAddress.zipcode!=""){
      formData.append("zipcode", this.signupAddress.zipcode);
    }
    formData.append("latitude", this.latitude);
    formData.append("longitude", this.longitude);
    formData.append("role", this.getFormValue("role"));
    formData.append("avatarId", this.activeIndex?this.activeIndex:null);
    if(this.checked == true && this.signupForm.valid == true) {
      this.isLoading = true;
      this.service.signUp(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.isLoading = false;
      this.service.signOut();
      this.router.navigateByUrl("/login-message");
      
      // signup next to dashboard
      // // everything ok but need band name and id while signup
      // this.userData = res.data.user;
      // this.tokenStorage.saveToken( res.data.accessToken));
      // this.tokenStorage.saveRefreshToken(res.data.refreshToken);
      // this.tokenStorage.saveToken(res.data.accessToken);
      // this.tokenStorage.saveRefreshToken(res.data.refreshToken);
      // localStorage.setItem("accessToken", res.data.accessToken);
      // localStorage.setItem("refreshToken", res.data.refreshToken);
      // localStorage.setItem("authgurd", "true");
      // localStorage.setItem("user", JSON.stringify(res.data.user));
      // localStorage.setItem("band", JSON.stringify(res.data.user.bands[0]));
      // localStorage.setItem("bands", JSON.stringify(res.data.user.bands));
      // this.isLoading = false;
      // if (this.userData.role.name === "listener") {
      //   this.toastrService.warning("please login in mobile app");
      // } else {
      // }

      // if (this.userData.role.name === "admin") {
      //   this.router.navigateByUrl("/admin");
      //   this.toastrService.success(res.message);
      // } else if ((this.userData.role.name === "artist" || this.userData.role.name === "listener") && this.userData.bands.length > 0) {
      //   this.router.navigateByUrl("/band");
      //   this.toastrService.success(res.message);
      // }
      // else if(this.userData.bands.length == 0){
        // this.service.signOut();
        //   this.router.navigateByUrl("/dashboard-fallback");
      // }
    });}
    else{
      
    }
    if (this.signupForm.valid) {
      const signupForm = { ...this.signupForm };
    } else {
      this.hasError = true;
    }
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
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
  // imageClick(img,index) {
  //   this.activeIndex = img.id;
  //   this.activeImage = img.url;
  // }
  // closeprofilepic(){
  //   this.profilePic=false;
  // }
  // cancelprofilepic(){
  //   this.activeIndex = null;
  //   this.activeImage = null;
  //   this.profilePic=false;
  // }
  // cancelModel(data){
  //   this.profilePic=data.close,
  //   this.activeIndex = data.id;
  //   this.activeImage = data.url;
  // }
  // removeavatar(data){
  //   this.profilePic=data;
  //   this.activeIndex=null,
  //   this.activeImage=null;
  // }
    // google map package
    public AddressChange(address: Address) {
      console.log(address);
       this.formattedaddress=address.formatted_address;
       this.typedaddress=address.formatted_address;
       this.latitude = address.geometry.location.lat()
       this.longitude = address.geometry.location.lng()
       const getSplitedAddress = location => {
        const splitedAddress = location.split(',');
        const addressLength = splitedAddress.length;
        if (addressLength > 0) {
          switch (addressLength) {
            case 2: {
              const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
              const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
              return {
                country: splitedAddress[addressLength - 1].trim(),
                zipcode: pincode,
                state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
                city: null,
                street: null,
              };
            }
            case 3: {
              const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
              const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
              return {
                country: splitedAddress[addressLength - 1].trim(),
                zipcode: pincode,
                state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
                city: splitedAddress[addressLength - 3].trim(),
                street: null,
              };
            }
            default: {
              if (addressLength >= 4) {
                const stateWithoutPincode = splitedAddress[addressLength - 2].replace(/[0-9]/g, '');
                const pincode = splitedAddress[addressLength - 2].replace(/^\D+/g, '');
                return {
                  country: splitedAddress[addressLength - 1].trim(),
                  zipcode: pincode,
                  state: stateWithoutPincode === '' ? null : stateWithoutPincode.trim(),
                  city: splitedAddress[addressLength - 3].trim(),
                  street: splitedAddress.splice(0, addressLength - 3).toString(),
                };
              }
            }
          }
        }
      };
      this.signupAddress = getSplitedAddress(this.formattedaddress)
      console.log(this.signupAddress)
    }
    address(data: any){
      this.formattedaddress=data
    }
  
    checkvalidlocation = (signupForm:any, location : any): boolean => {
      this.disablelocationSubmit = checklocation(
        signupForm,
        location,
        this.formattedaddress,
        this.typedaddress
      );
      return this.disablelocationSubmit;
    };
}
