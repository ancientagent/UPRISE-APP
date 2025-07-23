import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { BandService } from "src/app/api/services/band.service";
import { inputValidations, patterntValidations, checkDateValidation ,checklocation} from "src/app/common/utils";
import * as _ from "lodash";
import { Paginator } from "primeng/paginator/paginator";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { regularExpressions } from "src/app/common/regularexpressions";


@Component({
  selector: "app-events-management",
  templateUrl: "./events-management.component.html",
  styleUrls: ["./events-management.component.scss"],
})
export class EventsManagementComponent implements OnInit {
  @ViewChild('eventThumbnailElement', {static: false}) eventInputElement: ElementRef;
  searchtable : string;
  @ViewChild('pgevent') eventpagenator: Paginator;
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
  disableSubmit: boolean = false;
  isLoading: boolean = false;
  errorMessageDate: any;
  errorMessageStartDate: any;
  currentDate: any;
  totalrecords: any;
  searchSong: any;
  debounce: any;
  eventspage: any;
  errormessagelocation:string
  errorMessagelocation:string
  disablelocationSubmit: boolean;
  formattedaddress: any;
  typedaddress: any;
  eventreq: any;
  latitude: any;
  longitude: any;
  band: any;
  today: any;
  maxDate: Date;
  defaultobj:object = {page : 0,rows : 10}
  constructor(
    private fb: FormBuilder,
    private bandservice: BandService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.searchEvents = _.debounce(this.searchEvents, 1000);
    this.eventsForm = this.fb.group({
      eventName: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      eventLocation: ["", Validators.required],
      startTime: ["", Validators.required],
      endTime: ["", Validators.required],
      description: [""],
      link: [""],
    });
  }

  //event table
  cols = [
    { field: "thumbnail", header: "Poster ", index: 1 },
    { field: "eventName", header: "Event", index: 2 },
    { field: "location", header: "Venue", index: 3 },
    { field: "startTime", header: "Start and End Date ", index: 4 },
    { field: "endTime", header: "Start Time ", index: 5 },
    // { field: "startTime", header: "Time", index: 6 },
    { field: "actions", header: "Actions", index: 7 },
  ];

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
    this.bandservice.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.band = JSON.parse(localStorage.getItem("band"));
    this.today = new Date().toISOString()
    this.userbandId = this.band.id;
    this.paginate(this.defaultobj);
  }

  //events pagination
  paginate(event) {
    this.spinner.show()
    let data = {
      search: this.searchSong?this.searchSong:"",
      bandId: this.userbandId,
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.bandservice.getEventsData(data).subscribe((res: any) => {
      this.eventsData = res?.data;
      this.eventspage = res?.metadata;
      this.totalrecords = this.eventsData[0]?.totalCount;
      this.spinner.hide()
      if(res.data.length == 0  && res.metadata.currentPage >= 2){
        let obj = {
          search: this.searchSong?this.searchSong:"",
          bandId: this.userbandId,
          currentPage: this.eventspage ? this.eventspage.currentPage-1 : 1,
          perPage: this.eventspage ? this.eventspage.perPage : 10,
        };
        this.bandservice.getEventsData(obj).subscribe((res: any) => {
          this.eventsData = res.data;
          this.eventspage = res.metadata;
          this.totalrecords = this.eventsData[0]?.totalCount;
          setTimeout(() => {
            this.eventpagenator.changePage(this.eventspage.currentPage-1)
          }, 0);
        })
      }
    });
  }

  // search event
  searchEvents(event: any) {
    this.searchSong = event.target.value;
    let obj = {
      page : 0,
      rows : this.eventspage.perPage
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
    this.searchEvents(obj)
  }
  //error validations
  inputValidationsErrors = (eventsForm: any, type: any) => {
    return inputValidations(eventsForm, type);
  };


  checkstartTimeErrors = (eventsForm, startTime, endTime): boolean => {
    this.disableSubmit = checkDateValidation(
      eventsForm,
      startTime,
      endTime
    );
    return this.disableSubmit;
  };

  checkvalidlocation = (eventsForm, eventLocation): boolean => {
    this.disablelocationSubmit = checklocation(
      eventsForm,
      eventLocation,
      this.formattedaddress,
      this.typedaddress
    );
    return this.disablelocationSubmit;
  };

  //pattern validation
  inputPatternValidationsErrors = (form: any, type: any) => {
    return patterntValidations(form, type);
  };
  
  //add event modal
  Addevent() {
    this.eventsModal = true;
    this.header = " Create Event";
    this.action = "add";
    this.eventsForm.reset();
    this.removeImg();
  }

  //file upload
  onFileImageupload(event) {
    if (event?.target?.files && event?.target?.files[0]) {
      this.imgFile = event?.target?.files[0];
      this.ImgfileName = this.imgFile.name;
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(this.imgFile);
      this.viewImgages = true;
    }
  }

  // getFormValue
  getFormValue = (type) => this.eventsForm.get(type).value;

  //create event
  createEvent() {
    const formData = new FormData();
    formData.append("eventName",this.getFormValue("eventName") ? this.getFormValue("eventName") : "");
    formData.append("description", this.getFormValue("description") ? this.getFormValue("description") : "");
    formData.append("link", this.getFormValue("link") ? this.getFormValue("link") : "");
    formData.append(
      "location",      
      this.formattedaddress
        ? this.formattedaddress
        : ""
    );
    formData.append(
      "startTime",
      this.getFormValue("startTime") ? this.getFormValue("startTime") : ""
    );
    formData.append(
      "endTime",
      this.getFormValue("endTime") ? this.getFormValue("endTime") : ""
    );
    formData.append("thumbnail", this.imgFile ? this.imgFile : "");
    formData.append("latitude", this.latitude ? this.latitude: "");
    formData.append("longitude", this.longitude ? this.longitude : "");
    formData.append("bandId", this.userbandId ? this.userbandId : "");

      if (this.action == "add") {
        this.isLoading = true;
        this.eventreq = 
        this.bandservice.createEvent(formData).subscribe((res: any) => {
          this.toastrService.success(res.message);
          this.isLoading = false;
          this.eventsForm.reset();
          this.formattedaddress = "";
          this.typedaddress = "";
          this.removeImg();
          this.latitude = "";
          this.longitude = "";
          let obj = {
          page:0,
          rows:this.eventspage.perPage
          }
          this.paginate(obj);
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
            this.latitude = "";
            this.longitude = "";
            this.removeImg();
            this.eventsModal = false;
            let obj = {
              page:this.eventspage.currentPage-1,
              rows:this.eventspage.perPage
              }
              this.paginate(obj);          
            });
      }
    }

  //events modal close
  eventsModalClose() {
    this.eventsModal = false;
    this.eventreq?.unsubscribe();
    this.isLoading = false;
  }

  //remove image
  removeImg() {
    this.imageSrc = null;
    this.imgFile = null;
    this.viewImgages = false;
    this.eventInputElement.nativeElement.value = '';
  }

  //edit events
  editEvents(data: any) {
    this.eventsModal = true;
    this.action = "update";
    this.header = "Edit Event";
    this.eventsEditData = data;

    if (this.eventsEditData.thumbnail == null) {
      this.imageSrc = "";
      this.viewImgages = false;
    } else {
      this.viewImgages = true;
      this.imageSrc = this.eventsEditData.thumbnail;
      this.imgFile = this.eventsEditData.thumbnail;
    }
    if (this.action === "update") {
      this.eventsForm.patchValue({
        eventName: this.eventsEditData?.eventName,
        description: this.eventsEditData?.description,
        link: this.eventsEditData?.link,
        eventLocation: this.eventsEditData?.location ,
        startTime: new Date(this.eventsEditData?.startTime),
        endTime: new Date(this.eventsEditData?.endTime),
      });
      this.formattedaddress = this.eventsEditData?.location
      this.typedaddress = this.eventsEditData?.location
      this.longitude = this.eventsEditData?.longitude
      this.latitude = this.eventsEditData?.latitude
    } else {
    }
  }

  //delete event
  deleteEvent(id: any) {
    this.EventId = id;
    this.deleteEventModal = true;
  }

  // confirm Delete
  ConfirmDelete() {
    let obj = {
      bandId: this.userbandId,
    };

    this.bandservice.deleteEvent(this.EventId, obj).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteEventModal = false;
      let object = {
        page:this.eventspage.currentPage-1,
        rows:this.eventspage.perPage
        }
      this.paginate(object);
    });
  }
  //code delete modal;
  closeModal() {
    this.deleteEventModal = false;
  }

  onSelect(event) {
  }

  //search location
  search(event) {
    this.location = event;
    let obj = {
      input: this.location,
      types: "",
    };

    this.bandservice.getLocations(obj).subscribe((res: any) => {
      this.locationsList = res.predictions;
    });
  }
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
  //button loader
  buttonLoading() {
    this.isLoading = false;
  }

  // //get Events
  // getEventsData() {
  //   let obj = {
  //     search: this.searchSong?this.searchSong:"",
  //     bandId: this.userbandId,
  //     currentPage: this.eventspage ? this.eventspage.currentPage : 1,
  //     perPage: this.eventspage ? this.eventspage.perPage : 10,
  //   };
  //   this.bandservice.getEventsData(obj).subscribe((res: any) => {
  //     this.eventsData = res.data;
  //     this.eventspage = res.metadata;
  //     this.totalrecords = this.eventsData[0]?.totalCount;

  //     this.spinner.hide();
  //     if(res.data.length == 0  && res.metadata.currentPage >= 2){
  //       let obj = {
  //         search: this.searchSong?this.searchSong:"",
  //         bandId: this.userbandId,
  //         currentPage: this.eventspage ? this.eventspage.currentPage-1 : 1,
  //         perPage: this.eventspage ? this.eventspage.perPage : 10,
  //       };
  //       this.bandservice.getEventsData(obj).subscribe((res: any) => {
  //         this.eventsData = res.data;
  //         this.eventspage = res.metadata;
  //         this.totalrecords = this.eventsData[0]?.totalCount;
  //         setTimeout(() => {
  //           this.eventpagenator.changePage(this.eventspage.currentPage-1)
  //         }, 0);
  //       })
  //     }
  //   });
  // }
}
