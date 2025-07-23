import { Component, ElementRef, OnInit, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BandService } from "src/app/api/services/band.service";
import { inputValidations, patterntValidations } from "src/app/common/utils";

@Component({
  selector: "app-brand-memberlist",
  templateUrl: "./brand-memberlist.component.html",
  styleUrls: ["./brand-memberlist.component.scss"],
})
export class BrandMemberlistComponent implements OnInit {
  selected: any;
  @ViewChild("vid") ele: any;
  @ViewChild('bandPosterElement', {static: false}) albumPosterInputElement: ElementRef;
  @ViewChild('galleryElement', {static: false}) galleryInputElement: ElementRef;
  checked1: boolean = false;
  createMemberModal: boolean = false;
  creategalleryModal: boolean = false;
  bandForm: FormGroup;
  bandeditForm: FormGroup;
  errorList: any = "";
  hasError: boolean;
  bandId: any;
  imgFile: any;
  imageSrc: any;
  ImgfileName: any;
  imagegallerysrc: any;
  bandListData: any;
  viewImgages: boolean = false;
  galleryUploadedImages: boolean = false;
  editbanddescription: boolean = false;
  bandPoster: boolean = false;
  editPosterModal: boolean = false;
  inviteBandmemberModal: boolean = false;
  headerGalleryTitle: any;
  galleryaction: any;
  bandDetailsData: any;
  imgFilePoster: any;
  posterSrc: any;
  bandPosterView: boolean = false;
  isLoading: boolean = false;
  bandMemberData: any;
  bandAvatar: boolean = false;
  bandPic: boolean = false;
  urls: any = [];
  galleryImages: any = [];
  bandGalleryData: any;
  deleteGalleryImageModal: boolean = false;
  deleteGalleryImagesModalId: any;
  multiDeletecheckbox: any;
  deletegalleryid: any;
  showLinkedRisksOnly: any;
  deleteGalleryImages: any = [];
  imageserrormessage: any;
  disableSubmit: boolean = false;
  multiDeletecheckboxid: any;
  checkboxValues: any;
  bandUsersList: any;
  selectedEmail: any;
  enteredEmail: any;
  submitted = false;
  blur_bg: boolean = false;
  checkbox: string = "check_box";
  isShown: boolean = false;
  remainingText: number;
  activeIndex: number;
  displayCustom: boolean;
  images: any;
  removeBandMemberModal: boolean = false;
  removebandmember:any;
  removebandmemberid:any;
  band: any;
  select_all:boolean
  selectalllable:any='Select all'

  constructor(
    private bandservice: BandService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {
    this.bandForm = this.fb.group({
      inviteListnerEmail: ["", [Validators.required]],
    });

    this.bandDetilsForm();
  }

  bandDetilsForm() {
    this.bandeditForm = this.fb.group({
      band_description: [""],
    });
  }

  ngOnInit(): void {
    this.bandservice.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.band = JSON.parse(localStorage.getItem("band"));

    this.getBandId();
    
  }

  //pattern validation
  inputPatternValidationsErrors = (bandForm: any, type: any) => {
    return patterntValidations(bandForm, type);
  };

  //remaining text
  pattern = (bandForm: any, type: any) => {
    if (this.editbanddescription==true) {
      if(bandForm.get(type)?.value?.length < 250){
        this.remainingText = 250- bandForm.get(type).value.length;
      }
      else{
        this.remainingText = 0
      }
      return true;
    }
    return 
  };
  inputPatternValidations = (bandForm: any, type: any) => {
    return this.pattern(bandForm, type);
  };

  //error validations
  inputValidationsErrors = (bandForm: any, type: any) => {
    return inputValidations(bandForm, type);
  };

  //get band id
  getBandId() {
    this.blur_bg = true;
    this.spinner.show();
    this.bandservice.getBandId().subscribe((res: any) => {
      this.blur_bg = false;
      this.bandId = this.band.id;
      this.getBandDetails();
      this.getBandMember();
      this.getBandGallery();
    });
  }


  //get band member

  getBandMember() {
    this.spinner.show();
    this.bandservice.getBandMember(this.bandId).subscribe((res: any) => {
      this.bandMemberData = res.data;
      this.spinner.hide();
      if (this.bandMemberData.avatar == null) {
        this.bandAvatar = true;
      } else {
        this.bandPic = true;
      }
    });
  }

  //edit band poster
  bandPosterEdit() {
    this.removePoster();
    this.editPosterModal = true;
    if (this.bandDetailsData?.logo == null) {
    } else {
      this.bandPosterView = true;
      this.posterSrc = this.bandDetailsData?.logo;
    }
  }

  //edit poster file
  bandPosterUpload(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgFilePoster = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.posterSrc = reader.result);
      reader.readAsDataURL(this.imgFilePoster);
      this.bandPosterView = true;
    }
  }

  //remove poster
  removePoster() {
    this.posterSrc = "";
    this.bandPosterView = false;
    this.albumPosterInputElement.nativeElement.value = '';
  }
  //upload poster api

  editPoster() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append("logo", this.imgFilePoster ? this.imgFilePoster : this.posterSrc?this.posterSrc:"");
    formData.append("bandId", this.bandId ? this.bandId : "");
    formData.append("title", this.bandDetailsData?.title);
    formData.append("description", this.bandDetailsData?.description?this.bandDetailsData?.description:"");
    this.bandservice.updateBandDetails(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      // this.spinner.hide();
      this.isLoading = false;
      this.getBandDetails();
      this.editPosterModal = false;
      this.removePoster();
      this.imgFilePoster = "";
    });
  }

  //get band details

  getBandDetails() {
    this.bandservice.getBandDetails(this.bandId).subscribe((res: any) => {
      this.spinner.hide();
      this.bandDetailsData = res.data.band;
      if (this.bandDetailsData.logo == null) {
        this.bandPoster = false;
      } else {
        this.bandPoster = true;
      }
    });
  }

  //remove image
  removeImg() {
    this.imageSrc = "";
    this.viewImgages = false;
  }

  // create member modal
  createMember() {
    this.createMemberModal = true;
  }

  //create member
  inviteMember() {
    this.isLoading = true;
    let obj = {
      bandId: this.bandId,
      email: this.bandForm.value.inviteListnerEmail.email
        ? this.bandForm.value.inviteListnerEmail.email
        : this.enteredEmail,
    };

    this.bandservice.inviteBandMember(obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.isLoading = false;
      this.inviteBandmemberModal = false;
      this.bandForm.reset();
      this.getBandMember();
    });
  }
  get l() {
    return this.bandForm.controls;
  }

  // close  this.inviteBandmemerModal
  closeInviteMemberModal() {
    this.inviteBandmemberModal = false;
  }
  //create member api

  invitebandMember() {
    this.inviteBandmemberModal = true;
    this.bandForm.reset();
    // this.enteredEmail='';
  }

  //clode modal
  bandInviteModalClose() {
    this.createMemberModal = false;
  }

  //invite member using band username
  bandUsersSelect(event) {
    this.enteredEmail = event.query;
    let obj = {
      bandId: this.bandId,
      input: event.query,
    };
    this.bandservice.bandUsersSelect(obj).subscribe((res: any) => {
      this.bandUsersList = res.data;
    });
  }

  //selecte email
  onSelect(event) {
    this.selectedEmail = event.target.value;
  }

  //upload gallery modal
  uploadGalleryImages() {
    this.creategalleryModal = true;
    this.galleryInputElement.nativeElement.value = '';
    this.galleryaction = "add";
    this.galleryImages = [];
    this.headerGalleryTitle = "Upload Gallery";
    this.urls = [];
  }

  //delete upload gallery images
  removegalleryImg() {
    this.imagegallerysrc = "";
    this.galleryUploadedImages = false;
  }
  onGalleryImageupload(event) {
      const files = event.target.files;
      this.disableSubmit = true;
      if (files) {
        for (const file of files) {
          const objectUrl = URL.createObjectURL(file);
          this.ele.nativeElement.src = objectUrl;
          const reader = new FileReader();
          reader.onload = (e: any) => {
            if (file.type.indexOf("image") > -1) {
              this.urls.push(e.target.result);
              this.galleryImages.push(file);
            } else if (file.type.indexOf("video") > -1) {
                let inputVideo = file;
                let video = document.createElement('video');
                video.src   = window.URL.createObjectURL(inputVideo);
                video.preload = 'metadata';                
                video.onloadedmetadata =  ()=> {
                  if (video.duration < 30) {
                    this.urls.push(e.target.result);
                    this.galleryImages.push(file);
                  }
                  else if(video.duration > 30){
                    this.toastrService.warning("promo can't be more than 30 sec");
                  }
                }
            }
          };
          reader.readAsDataURL(file);
          if (this.galleryImages.length > 10) {
                this.imageserrormessage = "Maximum 10 images ";
              } else {
                this.imageserrormessage = "";
                this.disableSubmit = false;
              }
              this.galleryUploadedImages = true;
        }
      }
  }


  getDuration(e) {
    const duration = e.target.duration;
  }
  //upload postermodal close
  bandposterModalClose() {
    this.editPosterModal = false;
  }

  //edit description
  banddescriptionEdit() {
    this.editbanddescription = true;
    this.bandeditForm.patchValue({
      band_description: this.bandDetailsData?.description,
    });
  }

  //close band description modal
  banddescriptionModalClose() {
    this.editbanddescription = false;
  }

  //edit band description
  editDescription() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append("logo", this?.bandDetailsData?.logo);
    formData.append("bandId", this.bandId ? this.bandId : "");
    formData.append("title", this?.bandDetailsData?.title);

    formData.append(
      "description",
      this.bandeditForm.value.band_description
        ? this.bandeditForm.value.band_description
        : ""
    );
    this.bandservice.updateBandDetails(formData).subscribe((res: any) => {
      this.isLoading = false;
      this.toastrService.success(res.message);
      this.getBandDetails();
      this.banddescriptionModalClose();
    });
  }

  //upload gallery api
  uploadGallery() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append("bandId", this.bandId ? this.bandId : "");
    this.galleryImages.forEach((item) => {
      formData.append("uploadedImages", item ? item : "");
    });
    this.bandservice.uploadGallery(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.isLoading = false;
      this.creategalleryModal = false;
      this.galleryInputElement.nativeElement.value = '';
      this.removegalleryImg();
      this.galleryImages = [];
      this.getBandGallery();
      this.urls = [];
      this.deleteGalleryImages = [];
    });
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
    this.blur_bg == false;
  }
  //bandgalleryModalClose
  bandgalleryModalClose() {
    this.creategalleryModal = false;
    this.galleryInputElement.nativeElement.value = '';
    this.deleteGalleryImages = [];
    this.galleryImages = [];
    this.urls = [];
  }
  removeimage(id) {
    this.galleryInputElement.nativeElement.value = '';
    this.urls.splice(id, 1);
    this.galleryImages.splice(id, 1);
    if (this.galleryImages.length > 10) {
      this.imageserrormessage = "Maximum 10 images ";
    } else {
      this.imageserrormessage = "";
      this.disableSubmit = false;
    }
  }

  //get band gallery
  getBandGallery() {
    this.bandservice.getGallery(this.bandId).subscribe((res: any) => {
      this.bandGalleryData = res.data.bandGallery;
      this.images = this.bandGalleryData.map(item =>item.mediaURL);
    });
  }


  //delete gallery images modal
  deleteGalleryImagesModal(id) {
    this.deleteGalleryImages = [];
    this.deleteGalleryImages.push(id);
    this.deleteGalleryImageModal = true;
  }

  //modal gallery images multiple delete
  deleteGalleryImagesModalMulti() {
    this.deleteGalleryImageModal = true;
  }

  selectImage(event) {
    if (event.target.checked == true) {
      this.checkbox = "check_box_on";
    }
    if (event.target.checked == false) {
      this.checkbox = "check_box";
    }
  }

  //select all
  selectAll(values: any) {
    if (values.currentTarget.checked == true) {
      this.checkbox = "check_box_on";
      let checkBoxes = document.querySelectorAll(".check_box_select");
      checkBoxes.forEach((ele: any) => {
        this.deleteGalleryImages = [];
        ele.checked = true;
      });

      if (values.currentTarget.checked == true) {
        let checkBoxes = document.querySelectorAll(".check_box_select");
        checkBoxes.forEach((ele: any) =>
          this.deleteGalleryImages.push(ele.value)
        );
      }
    } else {
      let checkBoxes = document.querySelectorAll(".check_box_select");
      checkBoxes.forEach((ele: any) => {
        ele.checked = false;
        this.checkbox = "check_box";
        this.deleteGalleryImages = [];
        this.deleteGalleryImages.splice(
          this.deleteGalleryImages.indexOf(ele.value),
          1
        );
      });
    }
  }

  selectallbutton(){
    if(this.select_all==true){
      this.select_all=false
      this.selectalllable='Select all'
      let select = {currentTarget:{checked:this.select_all}}
      this.selectAll(select)
    }
    else{
      this.select_all=true
      this.selectalllable='Deselect all'
      let select = {currentTarget:{checked:this.select_all}}
      this.selectAll(select)
    }
  }


  //checkbox-delete
  multipleDeleteGalleryImages(values: any, id: any): void {
    this.checkboxValues = values;

    this.multiDeletecheckboxid = id;
    if (values.currentTarget.checked == true) {
      this.checkbox = "check_box_on";
      this.deleteGalleryImages.push(id);
    } else {
      this.deleteGalleryImages.splice(this.deleteGalleryImages.indexOf(id), 1);
      this.checkbox = "check_box";
    }
    if (this.deleteGalleryImages.length == this.bandGalleryData.length) {
      let checkBoxes = document.querySelectorAll(".selectAll_checkbox");
      checkBoxes.forEach((ele: any) => {
        ele.checked = true;
        this.select_all=true
        this.selectalllable='Deselect all'
      });
    } else {
      let checkBoxes = document.querySelectorAll(".selectAll_checkbox");
      checkBoxes.forEach((ele: any) => {
        ele.checked = false;
        this.select_all=false
        this.selectalllable='Select all'
        this.checkbox = "check_box";
      });
    }
  }

  //inputSelectAll
  inputSelectAll() {
    this.isShown = !this.isShown;
    if (this.isShown) {
      this.checkbox = "check_box_on";
      let checkBoxes = document.querySelectorAll(".check_box_select");
      checkBoxes.forEach((ele: any) => {
        this.deleteGalleryImages = [];
        ele.checked = true;
      });
      let checkBoxes1 = document.querySelectorAll(".selectAll_checkbox");
      checkBoxes1.forEach((ele: any) => {
        ele.checked = true;
      });

      if (this.isShown) {
        let checkBoxes = document.querySelectorAll(".check_box_select");
        checkBoxes.forEach((ele: any) =>
          this.deleteGalleryImages.push(ele.value)
        );
      }
    } else {
      let checkBoxes = document.querySelectorAll(".check_box_select");
      checkBoxes.forEach((ele: any) => {
        ele.checked = false;
        this.checkbox = "check_box";
        this.deleteGalleryImages = [];
        this.deleteGalleryImages.splice(
          this.deleteGalleryImages.indexOf(ele.value),
          1
        );
      });

      let checkBoxes1 = document.querySelectorAll(".selectAll_checkbox");
      checkBoxes1.forEach((ele: any) => {
        ele.checked = false;
      });
    }
  }

  //delete gallery images
  ConfirmDelete() {
    let obj = {
      imagesId: this.deleteGalleryImages,
    };
    this.bandservice.deleteGallery(this.bandId, obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteGalleryImageModal = false;
      this.getBandGallery();
      this.deleteGalleryImages = [];
      this.urls = [];
    });
  }

  //close delete gallery images modal
  deleteGalleryImagesModalClose() {
    this.deleteGalleryImageModal = false;
    // this.deleteGalleryImages = [];
  }

  valueChange() {
    let value = this.bandeditForm.get("band_description").value.length;
   }
   imageClick(index: number) {
    this.activeIndex = index;
    this.displayCustom = true;
  }
  removemember(data){
    this.removeBandMemberModal = true;
    this.removebandmember = data.userName;
    this.removebandmemberid = data.id;
  }
  deleteBandMemberModalClose(){
    this.removeBandMemberModal = false;
  }
  ConfirmRemove(){
    this.removeBandMemberModal = false;
    this.bandservice.removebandmember(this.bandId,this.removebandmemberid ).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.getBandMember();
    });
  }
}
