import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/api/services/admin.service";
import { BandService } from "src/app/api/services/band.service";
import { inputValidations,patterntValidations, checklocation, checkDateValidation , checkband} from "src/app/common/utils";
import * as _ from "lodash";
import { Paginator } from "primeng/paginator";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { regularExpressions } from "src/app/common/regularexpressions";

@Component({
  selector: "app-events-management",
  templateUrl: "./events-management.component.html",
  styleUrls: ["./events-management.component.scss"],
})
export class EventsManagementComponent implements OnInit {
  @ViewChild('dt',{ static: false }) dataTable: Paginator;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  private titleExp: any = regularExpressions.titleExp;
  selected: any;
  checked1: boolean = false;
  eventsModal: boolean = false;
  eventsForm: FormGroup;
  deleteEventModal: boolean = false;
  errorList: any = "";
  EventId: any;
  hasError: boolean;
  imgFile: any;
  ImgfileName: any;
  imageSrc: any;
  header: any;
  eventsData: any;
  viewImgages: boolean = false;
  action: any;
  eventsEditData: any;
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
  eventspage: any;
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
  currentDate: Date;
  maxDate: Date;
  clearband: boolean = true;
  customeloading: boolean;


  constructor(
    private fb: FormBuilder,
    private bandservice: BandService,

    private toastrService: ToastrService,
    private adminservice: AdminService,
    private spinner: NgxSpinnerService,
  ) {
    this.searchEvents = _.debounce(this.searchEvents, 1000);
    this.eventsForm = this.fb.group({
      eventName: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      band: ["", Validators.required],
      eventLocation: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      description: [""],
      poster:['']
    });
  }

  ngOnInit(): void {
    this.currentDate = new Date();
    let today = new Date();
    let month = today.getMonth();
    let year = today.getFullYear();

    let nextMonth = month + 4;
    // let nextYear = (nextMonth === 0) ? year + 1 : year;

    this.maxDate = new Date();
    this.maxDate.setMonth(nextMonth);
    // this.maxDate.setFullYear(nextYear);
    this.bandservice.buttonloader.subscribe((data) => {
      if (data === true) {
        this.buttonLoading();
      }
    });
    this.getEventsData();
    this.today = new Date().toISOString()
  }

  //event table
  cols = [
    { field: "thumbnail", header: "Poster ", index: 1 },
    { field: "eventName", header: "Name", index: 2 },
    { field: "band", header: "Band Name ", index: 3 },
    { field: "location", header: "Location ", index: 4 },
    { field: "startTime", header: "Start and End Date ", index: 5 },
    { field: "endTime", header: "Start Time ", index: 6 },
    { field: "actions", header: "Actions", index: 8 },
  ];

  //error validations
  inputValidationsErrors = (eventsForm: any, type: any) => {
    return inputValidations(eventsForm, type);
  };
  //pattern validation
  inputPatternValidationsErrors = (form: any, type: any) => {
    return patterntValidations(form, type);
  };

  // event form validations
  checkstartTimeErrors = (eventsForm, startTime, endTime): boolean => {
    this.disableSubmit = checkDateValidation(
      eventsForm,
      startTime,
      endTime
    );
    return this.disableSubmit;
  };
  
  checkvalidband = (songsForm:any, band : any): boolean => {
    this.disablebandSubmit = checkband(
      songsForm,
      band,
      this.selectedmail,
      this.enteredEmail
    );
    return this.disablebandSubmit;
  };

  //add event modal
  Addevent() {
    this.eventsModal = true;
    this.header = " Create New Event";
    this.action = "add";
    this.eventsForm.reset();
    this.removeImg();
  }
  //events modal close
  eventsModalClose() {
    this.eventsModal = false;
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
    this.eventsForm?.get("poster")?.setValue('');   
  }

  //edit events
  editEvents(data: any) {
    this.eventsModal = true;
    this.action = "update";
    this.header = "Edit Event";
    this.eventsEditData = data;
    this.userbandId = this.eventsEditData.band.id;

    if (this.eventsEditData.thumbnail == null) {
      this.imageSrc = "";
      this.viewImgages = false;
    } else {
      this.viewImgages = true;
      this.imageSrc = this.eventsEditData.thumbnail;
    }

    if (this.action === "update") {
      this.eventsForm.patchValue({
        eventName: this.eventsEditData?.eventName,
        eventLocation: this.eventsEditData?.location ,
        startTime: new Date(this.eventsEditData?.startTime),
        endTime: new Date(this.eventsEditData?.endTime),
        band:this.eventsEditData?.band,
        description:this.eventsEditData?.description
      });
      this.formattedaddress = this.eventsEditData?.location
      this.typedaddress = this.eventsEditData?.location
      this.longitude = this.eventsEditData?.longitude
      this.latitude = this.eventsEditData?.latitude
    } else {
    }
  }

  //get Events
  getEventsData() {
    this.spinner.show();
    let obj = {
      search: this.searchSong?this.searchSong:"",
      currentPage: this.eventspage ? this.eventspage.currentPage : 1,
      perPage: this.eventspage ? this.eventspage.perPage : 10,
    };

    this.adminservice.getEventsList(obj).subscribe((res: any) => {
      this.eventsData = res.data.data;
      this.totalrecords = this.eventsData[0]?.totalCount;
      this.eventspage = res.data.metadata;
      this.spinner.hide();

      if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        this.spinner.show();
        let obj = {
          search: this.searchSong?this.searchSong:"",
          currentPage: this.eventspage ? this.eventspage.currentPage-1 : 1,
          perPage: this.eventspage ? this.eventspage.perPage : 10,
        };
        this.adminservice.getEventsList(obj).subscribe((res: any) => {
          this.eventsData = res.data.data;
          this.totalrecords = this.eventsData[0].totalCount;
          this.eventspage = res.data.metadata;
          setTimeout(() => {
            this.dataTable.changePage(this.eventspage.currentPage-1);
          }, 0);
          this.spinner.hide();

        })
      }
    });
  }

  // getFormValue
  getFormValue = (type) => this.eventsForm.get(type).value;

  //create event
  createEvent() {
    if (this.eventsForm.valid) {
      const eventsForm = { ...this.eventsForm };
      //this.spinner.show();
    } else {
      this.hasError = true;
    }

    const formData = new FormData();
    formData.append("eventName",this.getFormValue("eventName") ? this.getFormValue("eventName") : "");
    formData.append("location",this.formattedaddress? this.formattedaddress: "");    
    formData.append("startTime",this.getFormValue("startTime") ? this.getFormValue("startTime") : "");
    formData.append("endTime",this.getFormValue("endTime") ? this.getFormValue("endTime") : "");
    formData.append("description", this.getFormValue("description") ? this.getFormValue("description") : "");
    if (this.action == "add") {
      this.userbandId = this.getFormValue("band").id 
    }
    formData.append("thumbnail", this.imgFile ? this.imgFile : this.imageSrc?this.imageSrc:"");
    formData.append("bandId", this.userbandId ? this.userbandId : "");
    formData.append("latitude", this.latitude ? this.latitude: "");
    formData.append("longitude", this.longitude ? this.longitude : "");

    if (this.action == "add") {
      this.isLoading = true;
      this.eventreq = 
      this.bandservice.createEvent(formData).subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.eventsForm.reset();
        this.formattedaddress = "";
        this.typedaddress = "";
        this.removeImg();
        this.latitude = "";
        this.longitude = "";
        this.isLoading = false;
        this.getEventsData();
        this.eventsModal = false;
      });
    } else {
      this.isLoading = true;
      this.eventreq = 
      this.bandservice
        .updateEvent(this.eventsEditData.id, formData).subscribe((res: any) => {
          this.toastrService.success(res.message);
          this.isLoading = false;
          this.eventsForm.reset();
          this.formattedaddress = "";
          this.typedaddress = "";
          this.removeImg();
          this.latitude = "";
          this.longitude = "";
          this.eventsModal = false;
          this.getEventsData();
        });
    }
  }

  //delete event
  deleteEvent(id: any, bandId: any) {
    this.EventId = id;
    this.deleteBandId = bandId;
    this.deleteEventModal = true;
  }

  // confirm delete event
  ConfirmDelete() {
    let obj = {
      bandId: this.deleteBandId,
    };

    this.adminservice.deleteEvent(this.EventId, obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteEventModal = false;
      this.getEventsData();
    });
  }
  clearbandsearch(data){
    this.eventsForm.get(data).reset();
  }

  //code delete modal;
  closeModal() {
    this.eventreq?.unsubscribe();
    this.isLoading = false;
    this.deleteEventModal = false;
  }


  //search location
  search(event) {
    this.location = event;
    let obj = {
      input: this.location,
      types: 'establishment',
    };

    this.bandservice.getLocations(obj).subscribe((res: any) => {
      this.locationsList = res.predictions;
    });
  }

  buttonLoading() {
    this.isLoading = false;
  }

  checkvalidlocation = (eventsForm, eventLocation): boolean => {
    this.disablelocationSubmit = checklocation(
      eventsForm,
      eventLocation,
      this.formattedaddress,
      this.typedaddress
    );
    return this.disablelocationSubmit;
  };
  
   // google map package
  public AddressChange(address: Address) {
   this.formattedaddress=address.name+","+address.formatted_address;
   this.typedaddress=address.name+","+address.formatted_address;
   this.latitude = address.geometry.location.lat()
   this.longitude = address.geometry.location.lng()
  }
  address(data: any){
   this.formattedaddress=data
  }

  //events pagination
  paginateEvents(event) {
    this.spinner.show()
    this.customeloading = true;
    
    let data = {
      search: this.searchSong?this.searchSong:"",
      currentPage: event.page + 1,
      perPage:  event.rows,
    };

    this.adminservice.searchEvents(data).subscribe((res: any) => {
      this.eventsData = res?.data?.data;
      this.eventspage = res.data.metadata;
      this.totalrecords = this.eventsData[0]?.totalCount  ;
      this.spinner.hide()
      this.customeloading = false;
    });
  }

  // search event
  searchEvents(event: any) {
    // this.spinner.show()
    this.searchSong = event.target.value;
    let obj = {
      page : 0,
      rows : this.eventspage.perPage
    }
    this.paginateEvents(obj);  
  }
  clearsearch(){
    this.searchtable= "";
    let obj = {
      target : {
        value : ""
      }
    }
    this.searchEvents(obj)
  }
  get l() {
    return this.eventsForm.controls;
  }

  //select band
  onSelect(event) {
    this.emptyFilterMessage="band have no albums"
    this.selectedmail = event.title
    this.enteredEmail = event.title
    this.userbandId = event.id
  }
  bandUsersSelect(event) {
    this.clearband=false
    this.userbandId = ""
    this.enteredEmail = event.query;
    let obj = {
      input: event.query,
    };
    this.adminservice.bandUsersSelect(obj).subscribe((res: any) => {
      this.bandUsersList = res.data;
      this.clearband=true

    });
  }
}


