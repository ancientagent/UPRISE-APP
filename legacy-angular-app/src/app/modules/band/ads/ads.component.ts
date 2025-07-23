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
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss']
})
export class AdsComponent implements OnInit {
  @ViewChild('dt',{ static: false }) dataTable: Paginator;
  @ViewChild('eventThumbnailElement', {static: false}) eventInputElement: ElementRef;
  @ViewChild("vid") ele: any;
  selected: any;
  checked1: boolean = false;
  adsModal: boolean = false;
  adsForm: FormGroup;
  deleteEventModal: boolean = false;
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
  band: any;
  vid:any
  duration: boolean = false;
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
      banner:['']
    });
   }

  ngOnInit(): void {
    this.bandservice.buttonloader.subscribe((data) => {
      if (data === true) {
        this.buttonLoading();
      }
    });
    this.band = JSON.parse(localStorage.getItem("band"));
    this.userbandId = this.band.id;
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
    this.adsModal = false;
  }

  //file upload
  onFileImageupload(event) {
    this.duration = false
    if (event.target.files && event.target.files[0]) {
      this.imgFile = event.target.files[0];
      this.adsForm.get('banner').setValue(this.imgFile)
      this.ImgfileName = this.imgFile.name;
      const reader = new FileReader();
      const file = event.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      this.ele.nativeElement.src = objectUrl;
      // const reader = new FileReader();
      reader.onload = (e: any) => {
        if (file.type.indexOf("image") > -1) {
          reader.onload = (e) => (this.imageSrc = reader.result);
          reader.readAsDataURL(this.imgFile);
          this.viewImgages = true;           
        } else if (file.type.indexOf("video") > -1) {
            let inputVideo = file;
            this.viewImgages = true; 
            let video = document.createElement('video');
            video.src   = window.URL.createObjectURL(inputVideo);
            video.preload = 'metadata';                
            video.onloadedmetadata =  ()=> {
              this.imageSrc = e.target.result
              if (video.duration < 45) {
              }
              else if(video.duration > 45){
                this.duration = true 
              }
            }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  //remove image
  removeImg() {
    this.imageSrc = "";
    this.imgFile = ''
    this.viewImgages = false;
    this.adsForm.get("banner").setValue('');   
    this.duration = false
    this.eventInputElement.nativeElement.value = '';

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
    this.removeImg();
    this.adsModal = true;
    this.action = "update";
    this.header = "Edit Ad";
    this.adsEditData = data;
    let location = this.adsEditData?.city + ", " + this.adsEditData?.state +(this.adsEditData?.country?( ", " + this.adsEditData.country):'');
    this.formattedaddress = location
    this.typedaddress = location
    this.longitude = this.adsEditData?.longitude
    this.latitude = this.adsEditData?.latitude
    if (this.adsEditData.banner == null) {
      this.imageSrc = "";
      this.viewImgages = false;
    } else {
      this.removeImg();
      this.viewImgages = true;
      this.imageSrc = this.adsEditData.banner;
      this.imgFile = this.adsEditData.banner;
    }

    if (this.action === "update") {
      this.adsForm.patchValue({
        title: this.adsEditData?.title,
        link: this.adsEditData?.link,
        description : this.adsEditData?.description,
        city:location,
        banner:this.adsEditData.banner
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
    // this.adsData =[{thumbnail:"https://ur-stage.s3.amazonaws.com/event-thumbnails/pexels-pixabay-210887%201%20%281%29.png",live:false,city:"austin",description:"lets make a music world",title:'Rise and Shine',link:'https://ur-stage.s3.amazonaws.com/event-thumbnails/pexels-pixabay-210887%201%20%281%29.png'},
    //                   {thumbnail:"https://ur-stage.s3.amazonaws.com/event-thumbnails/image%209.png",city:"jersy city",live:true,description:"walk with me",title:"Love makes life",link:"https://ur-stage.s3.amazonaws.com/event-thumbnails/image%209.png"},
    //                   {thumbnail:"https://ur-stage.s3.amazonaws.com/event-thumbnails/pexels-vishnu-r-nair-1105666%201%20%281%29.png",live:false,city:"texas city",description:"come to my world",title:"Earth is Wonderful",link:"https://ur-stage.s3.amazonaws.com/event-thumbnails/pexels-vishnu-r-nair-1105666%201%20%281%29.png"}]
    // this.totalrecords = 3
    let obj = {
      search: this.searchSong?this.searchSong:"",
      bandId: this.userbandId,
      currentPage: this.adspage ? this.adspage.currentPage : 1,
      perPage: this.adspage ? this.adspage.perPage : 10,
    };

    this.bandservice.getAdsList(obj).subscribe((res: any) => {
      this.adsData = res.data.data;
      this.totalrecords = this.adsData[0]?.totalCount;
      this.adspage = res.data.metadata;
      this.spinner.hide();

      if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        this.spinner.show();
        let obj = {
          search: this.searchSong?this.searchSong:"",
          currentPage: this.adspage ? this.adspage.currentPage-1 : 1,
          perPage: this.adspage ? this.adspage.perPage : 10,
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
    formData.append("bandId", this.userbandId ? this.userbandId : "");
    if (this.action == "add") {
      this.isLoading = true;
      this.eventreq = 
      this.bandservice.createAds(formData).subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.adsForm.reset();
        this.removeImg();
        this.isLoading = false;
        this.getadsData();
        this.adsModal = false;
      });
    } else {
      this.isLoading = true;
      this.eventreq = 
      this.bandservice
        .updateAd(this.adsEditData.id, formData)
        .subscribe((res: any) => {
          this.toastrService.success(res.message);
          this.isLoading = false;
          this.adsForm.reset();
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
    this.bandservice.deleteAds(this.adsId, obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteEventModal = false;
      this.getadsData();
    });
  }

  // live ad
  adLive(id, live) {
    let obj = {
      bannerId: id,
      live: live,
    };

    this.bandservice.adLive(obj).subscribe((res: any) => {
      // this.toastrService.success(res.message);
    });
  }
  //code delete modal;
  closeModal() {
    this.eventreq?.unsubscribe();
    this.isLoading = false;
    this.deleteEventModal = false;
  }

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
      bandId: this.userbandId,
    };

      this.bandservice.getAdsList(data).subscribe((res: any) => {
      this.adsData = res?.data?.data;
      this.adspage = res.data.metadata;
      this.totalrecords = this.adsData[0]?.totalCount  ;
      this.spinner.hide()
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
}
