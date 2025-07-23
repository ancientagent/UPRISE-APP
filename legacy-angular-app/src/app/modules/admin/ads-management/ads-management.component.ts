import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BandService } from "src/app/api/services/band.service";
import { AdminService } from "src/app/api/services/admin.service";
import { inputValidations, checklocation} from "src/app/common/utils";
import * as _ from "lodash";
import { Paginator } from "primeng/paginator/paginator";
import { Address } from "ngx-google-places-autocomplete/objects/address";

@Component({
  selector: "app-ads-management",
  templateUrl: "./ads-management.component.html",
  styleUrls: ["./ads-management.component.scss"],
})
export class AdsManagementComponent implements OnInit {
  @ViewChild('dt',{ static: false }) dataTable: Paginator;
  selected: any;
  checked1: boolean = false;
  adsModal: boolean = false;
  adsForm: FormGroup;
  deleteEventModal: boolean = false;
  blockEventModal: boolean = false;

  errorList: any = "";
  adsId: any;
  hasError: boolean;
  imgFile: any;
  ImgfileName: any;
  imageSrc: any;
  header: any;
  adsData: any;
  viewImgages: boolean = false;
  action: any;
  adsEditData: any;
  locationsList: any = [];
  location: any;
  predictionsLocations: any;
  selectedLocation: any = [];
  userbandId: any;
  user: any;
  deleteBandId: any;
  isLoading = false;
  totalrecords: number;
  searchSong: any;
  adspage: any;
  eventreq: any;
  formattedaddress: any;
  typedaddress: any;
  errorMessagelocation: string;
  disablelocationSubmit: boolean;
  errorMessageDate: string;
  disableSubmit: boolean;
  latitude: any;
  longitude: any;
  searchtable: string;
  bandUsersList:any;
  enteredEmail: any;
  emptyFilterMessage: string;
  selectedmail: any;
  disablebandSubmit: boolean;
  today: any;
  tooltip:any = "Copy";
  bands:any = [];
  selectedbands:any = [];
  bandsList: any =[];
  blockadid: any;
  blockedstatus: any;

  constructor(
    private fb: FormBuilder,
    private bandservice: BandService,
    private toastrService: ToastrService,
    private adminservice: AdminService,
    private spinner: NgxSpinnerService,
  ) {
    this.searchads = _.debounce(this.searchads, 1000);
    this.adsForm = this.fb.group({
      title: ["", Validators.required],
      link: ["", Validators.required],
      city: ["", Validators.required],
      description: [""],
    });
  }

  ngOnInit(): void {
    this.adminservice.getBands().subscribe((res: any) => {
      this.bands = res['data']
    })
    this.bandservice.buttonloader.subscribe((data) => {
      if (data === true) {
        this.buttonLoading();
      }
    });
    this.getadsData();
  }

  //error validations
  inputValidationsErrors = (adsForm: any, type: any) => {
    return inputValidations(adsForm, type);
  };

  //add event modal
  Addevent() {
    this.adsModal = true;
    this.header = " Create New Ad";
    this.action = "add";
    this.adsForm.reset();
    this.removeImg();
  }
  //ads modal close
  adsModalClose() {
    this.eventreq?.unsubscribe();
    this.isLoading = false;
    this.adsModal = false;
  }

  //file upload
  onFileImageupload(event) {
    if (event.target.files && event.target.files[0]) {
      this.imgFile = event.target.files[0];
      this.ImgfileName = this.imgFile.name;
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

  // copy
  copy(that){
    this.tooltip = "Copied"
    var inp =document.createElement('input');
    document.body.appendChild(inp)
    inp.value =that
    inp.select();
    document.execCommand('copy',false);
    inp.remove();
  }
  mouseleave(){
    this.tooltip = "Copy"
  }

  //edit ads
  editads(data: any) {
    this.adsModal = true;
    this.action = "update";
    this.header = "Edit Ad";
    this.adsEditData = data;
    let location = this.adsEditData?.city + ", " + this.adsEditData?.state +(this.adsEditData?.country?( ", " + this.adsEditData.country):'');
    this.formattedaddress = location
    this.typedaddress = location
    this.longitude = this.adsEditData?.longitude
    this.latitude = this.adsEditData?.latitude
    this.userbandId = this.adsEditData?.bandId
    if (this.adsEditData.banner == null) {
      this.imageSrc = "";
      this.viewImgages = false;
    } else {
      this.viewImgages = true;
      this.imageSrc = this.adsEditData.banner;
    }

    if (this.action === "update") {
      this.adsForm.patchValue({
        title: this.adsEditData?.title,
        link: this.adsEditData?.link,
        description : this.adsEditData?.description,
        city:location,
      });
    } else {
    }
  }

  // google map package
  public AddressChange(address: Address) {
   this.formattedaddress=address.formatted_address;
   this.typedaddress=address.formatted_address;
   this.latitude = address.geometry.location.lat()
   this.longitude = address.geometry.location.lng()
  }
  address(data: any){
    this.formattedaddress=data
  }
  checkvalidlocation = (form, eventLocation): boolean => {
   this.disablelocationSubmit = checklocation(
     form,
     eventLocation,
     this.formattedaddress,
     this.typedaddress
   );
   return this.disablelocationSubmit;
  };

  //get ads
  getadsData() {
    this.spinner.show();
    let obj = {
      search: this.searchSong?this.searchSong:"",
      currentPage: this.adspage ? this.adspage.currentPage : 1,
      perPage: this.adspage ? this.adspage.perPage : 10,
      bands: this.bandsList ? this.bandsList : []
    };
    this.adminservice.getAdsList(obj).subscribe((res: any) => {
      this.adsData = res.data.data;
      this.adspage = res.data.metadata;
      this.totalrecords = this.adsData[0]?.totalCount;
      this.spinner.hide();
      if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        this.spinner.show();
        let obj = {
          search: this.searchSong?this.searchSong:"",
          currentPage: this.adspage ? this.adspage.currentPage-1 : 1,
          perPage: this.adspage ? this.adspage.perPage : 10,
          bands: this.bandsList ? this.bandsList : []
        };
        this.adminservice.getAdsList(obj).subscribe((res: any) => {
          this.adsData = res.data.data;
          this.totalrecords = this.adsData[0].totalCount;
          this.adspage = res.data.metadata;
          setTimeout(() => {
            this.dataTable.changePage(this.adspage.currentPage-1);
          }, 0);
          this.spinner.hide();

        })
      }
    });
  }

  // getFormValue
  getFormValue = (type) => this.adsForm.get(type).value;

  //create event
  createAds() {
    const formData = new FormData();
    formData.append("title",this.getFormValue("title") ? this.getFormValue("title") : "");
    formData.append("link",this.getFormValue("link") ? this.getFormValue("link") : "");
    formData.append("city", this.formattedaddress.split(",")[0]);
    formData.append("state", this.formattedaddress.split(",")[1]);
    formData.append("country", this.formattedaddress.split(",")[2] || null);
    formData.append("description",this.getFormValue("description") ? this.getFormValue("description") : "");
    formData.append("banner", this.imgFile ? this.imgFile : this.imageSrc?this.imageSrc:"");
    formData.append("latitude", this.latitude ? this.latitude: "");
    formData.append("longitude", this.longitude ? this.longitude : "");
    if (this.action == "add") {
      this.isLoading = true;
      this.eventreq = 
      this.adminservice.createAds(formData).subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.adsForm.reset();
        this.removeImg();
        this.isLoading = false;
        this.getadsData();
        this.adsModal = false;
      });
    } else {
      formData.append("bandId", this.userbandId ? this.userbandId : "");
      this.isLoading = true;
      this.eventreq = 
      this.bandservice
        .updateAd(this.adsEditData.id, formData)
        .subscribe((res: any) => {
          this.isLoading = false;
          this.removeImg();
          this.adsModal = false;
          this.getadsData();
        });
    }
  }

  //delete event
  deleteEvent(id: any, bandId: any) {
    this.adsId = id;
    this.deleteEventModal = true;
  }

  // confirm delete event
  ConfirmDelete() {
    let obj = {
      bandId: this.deleteBandId,
    };
    this.adminservice.deleteAds(this.adsId, obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteEventModal = false;
      this.getadsData();
    });
  }

  blockad(id,blocked){
    this.blockadid = id,
    this.blockedstatus = blocked
    this.blockEventModal = true
  }
  // block ad
  confirmBlockad(){
    let data={
      bannerId:this.blockadid,
      blocked:this.blockedstatus
    }
    this.adminservice.blockad(data).subscribe((res: any) => {
      // this.toastrService.success(res.message);
      this.blockEventModal = false;
      this.getadsData();
    })
  }

  // live ad
  adLive(id, live) {
    let obj = {
      adId: id,
      live: live,
    };

    this.adminservice.adLive(obj).subscribe((res: any) => {
      // this.toastrService.success(res.message);
    });
  }
  //code delete modal;
  closeModal() {
    this.deleteEventModal = false;
    this.blockEventModal = false;
  }


  // //search location
  // search(event) {
  //   this.location = event;
  //   let obj = {
  //     input: this.location,
  //     types: 'establishment',
  //   };

  //   this.bandservice.getLocations(obj).subscribe((res: any) => {
  //     this.locationsList = res.predictions;
  //   });
  // }

  buttonLoading() {
    this.isLoading = false;
  }

  //ads pagination
  paginateads(event) {
    this.spinner.show()
    let data = {
      search: this.searchSong?this.searchSong:"",
      currentPage: event.page + 1,
      perPage:  event.rows,
      bands: this.bandsList ? this.bandsList : []
    };
    this.adminservice.getAdsList(data).subscribe((res: any) => {
      this.adsData = res?.data?.data;
      this.adspage = res.data.metadata;      
      this.totalrecords = this.adsData[0]?.totalCount;
      this.spinner.hide()
        if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        this.spinner.show();
        let obj = {
          search: this.searchSong?this.searchSong:"",
          currentPage: this.adspage ? this.adspage.currentPage-1 : 1,
          perPage: this.adspage ? this.adspage.perPage : 10,
          bands: this.bandsList ? this.bandsList : []
        };
        this.adminservice.getAdsList(obj).subscribe((res: any) => {
          this.adsData = res.data.data;
          this.totalrecords = this.adsData[0].totalCount;
          this.adspage = res.data.metadata;
          setTimeout(() => {
            this.dataTable.changePage(this.adspage.currentPage-1);
          }, 0);
          this.spinner.hide();
        })
      }
    });
  }

  // search event
  searchads(event: any) {
    this.spinner.show()
    this.searchSong = event.target.value;
    let obj = {
      page : 0,
      rows : this.adspage.perPage
    }
    this.paginateads(obj);  
  }
  clearsearch(){
    this.searchtable= "";
    let obj = {
      target : {
        value : ""
      }
    }
    this.searchads(obj)
  }
  get l() {
    return this.adsForm.controls;
  }

  // select bands
  bandsSelect(data: any) {
    this.bandsList = data.map((a) => a.id);
    let obj = {
      page : 0,
      rows : this.adspage.perPage
    }
    this.paginateads(obj);  
  }

}


