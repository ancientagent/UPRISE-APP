import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/api/services/admin.service";
import { BandService } from "src/app/api/services/band.service";
import {
  checkPasswordadmin,
  inputValidations,
  patterntValidations,
} from "src/app/common/utils";
import * as _ from "lodash";
import { Paginator } from "primeng/paginator/paginator";
import { regularExpressions } from "src/app/common/regularexpressions";

@Component({
  selector: "app-user-management",
  templateUrl: "./user-management.component.html",
  styleUrls: ["./user-management.component.scss"],
})
export class UserManagementComponent implements OnInit {
  @ViewChild('userpaginator',{ static: false }) userpaginator: Paginator;
  private emailExp: string = regularExpressions.emailExp;
  private passwordExp: any = regularExpressions.passwordExp;
  private titleExp: any = regularExpressions.titleExp;
  GenderOptions = [
    {
      name: "MALE",
    },
    {
      name: "FEMALE",
    },
    {
      name: "PREFER NOT TO SAY",
    },
  ];
  status = [
    {
      name: "ACTIVE",
    },
    {
      name: "BLOCKED",
    },
    {
      name: "INACTIVE",
    },
  ];
  selected: any;
  checked1: boolean = false;
  usersList: any;
  action: any;
  errorList: any = "";
  hasError: boolean;
  editUserModal: boolean = false;
  deleteuserModal: boolean = false;
  usermanagementForm: FormGroup;
  imgFile: any;
  imageSrc: any;
  viewImgages: any;
  UserData: any;
  userId: any;
  disableSubmit: any;
  isLoading: boolean = false;
  debounce: any;
  totalCount: any;
  userpageData: any;
  totalrecords: number;
  mobile: any;
  searchdata:any;
  searchtable: string;
  profilePic: boolean;
  activeIndex: any;
  activeImage: any;
  clickedImage: any;
  clickedIndex: any;
  constructor(
    private adminService: AdminService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private bandservice: BandService,
    private fb: FormBuilder
  ) {
    this.searchUsers = _.debounce(this.searchUsers, 1000);
    this.usermanagementForm = this.fb.group({
      email: [
        "",
        [
          Validators.email,
          Validators.pattern(this.emailExp),
        ],
      ],

      userName: ["", [Validators.required , Validators.pattern(this.titleExp)]],

      mobileno: [""],
      role: [""],
      gender: [""],
      status: [""],
      confirmpassword: [
        "",
        [Validators.minLength(8), Validators.maxLength(20)],
      ],
      password: [
        "",
        [
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(this.passwordExp),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.getUsersList();
    this.bandservice.buttonloader.subscribe((data) => {
      if (data === true) {
        this.buttonLoading();
      }
    });
  }

  cols = [
    { field: "profilePicture", header: "Avatar", index: 1 },
    { field: "name", header: "Name ", index: 2 },
    { field: "email", header: "Email ID ", index: 3 },
    { field: "phoneNo", header: "Phone No  ", index: 4 },
    { field: "role", header: "Role  ", index: 5 },
    { field: "promos", header: "promos  ", index: 6 },
    { field: "status", header: "Status", index: 7 },
    { field: "actions", header: "Actions", index: 8},
  ];

  //edit user
  editUser(data: any) {
    this.activeImage = null;
    this.activeIndex = null;
    this.clickedImage = null
    this.clickedIndex = null
    this.editUserModal = true;
    this.action = "update";
    this.UserData = data;
    this.activeImage = this.UserData.avatar?this.UserData.avatar:null;
    this.activeIndex = this.UserData.avatarId?this.UserData.avatarId:null;
    this.clickedImage = this.UserData.avatar?this.UserData.avatar:null;
    this.clickedIndex = this.UserData.avatarId?this.UserData.avatarId:null;
    if (this.UserData.avatar == null) {
      // this.activeImage = null;
      // this.activeIndex = null;
      this.viewImgages = false;
    } else {
      // this.activeImage = this.UserData.avatar;
      // this.activeIndex = this.UserData.avatarId;
      this.viewImgages = true;
    }
    this.usermanagementForm
      .get("gender")
      .setValue({ name: this.UserData.gender });
    this.usermanagementForm.patchValue({
      userName: this.UserData?.userName,

      email: this.UserData?.email,
      mobileno: this.UserData?.mobile,
      role: this.UserData?.role.name,
      status: { name: this.UserData.status },
    });
  }

  //pattern validation
  inputPatternValidationsErrors = (usermanagementForm: any, type: any) => {
    return patterntValidations(usermanagementForm, type);
  };
  //number validation
  numberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  //upload images
  onFileImageupload(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgFile = event.target.files[0];

      //this.ImgfileName = this.imgFile.name;

      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);

      reader.readAsDataURL(this.imgFile);
      this.viewImgages = true;
    }
  }

  //remove image
  removeImg() {
    this.imageSrc = "";
    this.viewImgages = false;
  }

  // enable promos
  promos(id, live) {
    let obj = {
      userId:id,
      enabled: live
    };
    this.adminService.promo(obj).subscribe((res: any) => {
    });
  }
  //error validations
  inputValidationsErrors = (usermanagementForm: any, type: any) => {
    return inputValidations(usermanagementForm, type);
  };

  // passsword error validation
  checkPasswordErrors = (userForm, newPass, oldPass): boolean => {
    this.disableSubmit = checkPasswordadmin(userForm, newPass, oldPass);
    return this.disableSubmit;
  };

  usersModalClose(){
    this.editUserModal = false;
    this.usermanagementForm.reset();
    this.activeImage = null;
    this.activeIndex = null;
    this.clickedImage = null
    this.clickedIndex = null
  }

  UpdateUsers() {
    if (this.usermanagementForm.valid) {
      const usermanagementForm = { ...this.usermanagementForm };
      // this.spinner.show();
      this.isLoading = true;
    } else {
      this.hasError = true;
    }

    const formData = new FormData();
    formData.append(
      "email",
      this.usermanagementForm.get("email").value
        ? this.usermanagementForm.get("email").value
        : ""
    );
    formData.append(
      "userName",
      this.usermanagementForm.get("userName").value
        ? this.usermanagementForm.get("userName").value
        : ""
    );
    formData.append(
      "mobile",
      this.usermanagementForm.get("mobileno").value
        ? this.usermanagementForm.get("mobileno").value
        : ""
    );
    formData.append(
      "role",
      this.usermanagementForm.get("role").value
        ? this.usermanagementForm.get("role").value
        : ""
    );
    formData.append(
      "status",
      this.usermanagementForm.get("status").value.name
        ? this.usermanagementForm.get("status").value.name
        : ""
    );
    formData.append(
      "gender",

      ""
    );
    formData.append(
      "password",
      this.usermanagementForm.get("password").value
        ? this.usermanagementForm.get("password").value
        : ""
    );
    formData.append("avatarId", this.activeIndex ? this.activeIndex :null);

    this.adminService
      .updateDetails(this.UserData.id, formData)
      .subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.isLoading = false;
        this.getUsersList();
        this.usermanagementForm.reset();
        this.removeImg();
        this.imgFile = "";
        this.editUserModal = false;
        this.activeImage = null;
        this.activeIndex = null;
        this.clickedImage = null
        this.clickedIndex = null
      });
  }

  //get users
  getUsersList() {
    this.spinner.show();
    let obj = {
      search: this.searchdata?this.searchdata:"",
      currentPage: this.userpageData ? this.userpageData.currentPage : 1,
      perPage: this.userpageData ? this.userpageData.perPage : 10,
    };
    this.adminService.getUsersList(obj).subscribe((res: any) => {
      this.usersList = res?.data?.data;
      this.totalrecords = this.usersList[0]?.totalCount;
      this.userpageData = res?.data?.metadata;
      this.spinner.hide();
    });
  }
  //delete user
  deleteuser(id: any) {
    this.userId = id;
    this.deleteuserModal = true;
  }

  // confirm Delete
  ConfirmDelete() {
    this.adminService.deleteUser(this.userId).subscribe((res: any) => {
      this.deleteuserModal = false;
      this.toastrService.success(res.message);
      this.getUsersList();
    });
  }
  
  //close modal
  closeModal() {
    this.deleteuserModal = false;
  }

  buttonLoading() {
    this.isLoading = false;
  }

  //search users
  searchUsers(event: any) {
    this.spinner.show()
    this.searchdata = event.target.value;
    let obj = {
      page : 0,
      rows : this.userpageData.perPage
    }
    this.paginate(obj);  
  }
  clearsearch(){
    this.searchtable= "";
    let obj = {
      target : {
        value : ""
      }
    }
    this.searchUsers(obj)
  }

  // pagination
  paginate(event) {
    this.spinner.show()
    let obj = {
      search: this.searchdata?this.searchdata:"",
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.adminService.getUsersList(obj).subscribe((res: any) => {
      this.usersList = res.data.data;
      this.userpageData = res?.data?.metadata;
      this.totalrecords = this.usersList[0]?.totalCount;
      this.spinner.hide()
    });
  }

  //activteUser
  activateUser(id: any) {
    this.adminService.activateUser(id).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.getUsersList();
    });
  }
  // profile pic upload
  profileUpload(){
    this.profilePic=true;
  }
  cancelModel(data){
    this.profilePic=false;
    this.clickedImage = this.activeImage 
    this.clickedIndex = this.activeIndex
    if(this.activeImage !== null){
      this.viewImgages = true;
    }
    if(this.activeImage == null){
      this.viewImgages = false;
    }
  }
  removeavatar(data){
    this.clickedImage = null
    this.clickedIndex = null
  }
  saveModel(data){
    this.activeImage = this.clickedImage
    this.activeIndex = this.clickedIndex    
    this.profilePic=false;
    if(this.activeImage !== null){
      this.viewImgages = true;
    }
    if(this.activeImage == null){
      this.viewImgages = false;
    }
  }
  clickModel(img){
    this.clickedImage = img.url
    this.clickedIndex = img.id
  }
  // cancelModel(data){
  //   this.profilePic=data.close,
  //   this.activeIndex = data.id;
  //   this.activeImage = data.url;
  //   if(this.activeImage !== null){
  //     this.viewImgages = true;
  //   }
  //   if(this.activeImage == null){
  //     this.viewImgages = false;
  //   }
  // }
  // removeavatar(data){
  //   this.activeIndex=null;
  //   this.activeImage=null;
  //   // this.UserData.avatarId=null;
  //   // this.UserData.avatar=null;
  //   this.profilePic=data;
  //   this.viewImgages = false;
  // }
}
