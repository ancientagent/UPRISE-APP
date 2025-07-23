import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ConfirmationService, LazyLoadEvent } from "primeng/api";
import { AuthService } from "src/app/api/services/auth.service";
import { BandService } from "src/app/api/services/band.service";
import { inputValidations, patterntValidations, checkgenres ,checklocation} from "src/app/common/utils";
import { Subject } from "rxjs/internal/Subject";
import * as _ from "lodash";
import { GooglePlaceDirective } from "ngx-google-places-autocomplete";
import { Paginator } from "primeng/paginator";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { regularExpressions } from "src/app/common/regularexpressions";
import { geners } from "src/app/common/genres";

@Component({
  selector: "app-songs-management",
  templateUrl: "./songs-management.component.html",
  styleUrls: ["./songs-management.component.scss"],
})
export class SongsManagementComponent implements OnInit {
  private subject: Subject<string> = new Subject();
  @ViewChild('songThumbnailElement', {static: false}) songInputElement: ElementRef;
  @ViewChild('songAudioElement', {static: false}) songAudioInputElement: ElementRef;
  @ViewChild('albumThumbnailElement', {static: false}) albumInputElement: ElementRef;
  @ViewChild("placesRef") placesRef : GooglePlaceDirective;
  @ViewChild('pgsong') songpagenator: Paginator;
  @ViewChild('pgalbum') albumpagenator: Paginator;
  @ViewChild('pgalbumsong') albumsongpagenator: Paginator;
  private titleExp: any = regularExpressions.titleExp;
  private geners: any = geners;
  selected: any;
  checked1: boolean = false;
  songsUploadModal: boolean = false;
  albumsUploadModal: boolean = false;
  deleteModal: boolean = false;
  errorList: any = "";
  hasError: boolean;
  file: File;
  fileAudio: any;
  duration: any;
  fileName: any;
  fileType: any;
  fileSize: any;
  showAudiodata: boolean = false;
  imageSrc: any;
  ImgfileName: any;
  imgFile: any;
  viewImgages: boolean = false;
  songsForm: FormGroup;
  songsListData: any;
  songsgenre: any = [];
  selectedGeners: any = [];
  cities: any[];
  songId: any;
  liveId: any;
  action: string;
  genresList: any;
  songsData: any;
  header: string;
  isLoading: boolean = false;
  currentURL: any;
  AlbumimgFile: any;
  albumimageSrc: any;
  disableSubmit: boolean = false;
  AlbumviewImgages: boolean = false;
  albumsForm: FormGroup;
  userbandId: any;
  albumsListData: any = [];
  albumsData: any = [];
  albumOptions: any[];
  location: any;
  locationsList: any = [];
  userData: any;
  albumSongsList: any = [];
  finalGeners: any = [];
  indivisualAlbumData: any;
  updatealbumId: any;
  deleteAlbummodal: boolean = false;
  albumsDeleteId: any;
  totalrecords: number;
  searchSong: string;
  searchAlbum: string;
  searchAlbumSong: string;
  albumsTotalcount: number;
  totalcountAlbumSongs: number;
  debounce: any;
  pageData: any;
  album_name: any;
  albumpageData: any;
  errorMessage: any = "";
  albumsongspage: any;
  errorMessagelocation:string;
  disablelocationSubmit: boolean;
  searchlocation:any;
  formattedaddress:any;
  pageno: any;
  error:any;
  typedaddress: any;
  req: any;
  albumreq: any;
  genremax: boolean;
  disablegenreSubmit: boolean;
  perpage: any;
  latitude: any;
  longitude: any;
  searchsongtable: string;
  searchalbumtable: string;
  searchalbumsongstable: string;
  band: any;
  genersOptions: { name: string; id: string; }[];
  clearobj:object = {target:{value:''}}

  constructor(
    private fb: FormBuilder,
    private bandservice: BandService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.searchSongs = _.debounce(this.searchSongs, 1000);
    this.searchAlbums = _.debounce(this.searchAlbums, 1000);
    this.searchAlbumSongs = _.debounce(this.searchAlbumSongs, 1000);
    this.albumsForm = this.fb.group({
      albumtitle: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      avatar: [""],
    });
    this.songsForm = this.fb.group({
      title: ["", [Validators.required , Validators.pattern(this.titleExp)]],
      thumbnail: [""],
      song: [""],
      genre: ["",Validators.required],
      albumName: [""],
      cityName: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.band = JSON.parse(localStorage.getItem("band"));
    this.bandservice.getGenres().subscribe((res: any) => {
      this.genersOptions = res['data']
    })
    this.indivisualAlbumData = JSON.parse(localStorage.getItem("albumData"));
    this.currentURL = this.router?.url;
    this.bandservice.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.bandservice.liveError.subscribe((res) => {
      if (res == true) {
        let liveindex = this.songsListData.findIndex((obj=>obj.id == this.liveId))
        this.songsListData[liveindex].live = false
      }
    });
    this.userbandId = this.band.id;
    this.spinner.show();
    if (this.currentURL == "/band/songsmanagement/albums/songs") {
      this.getindivualAlbumSongs();
    } else if (this.currentURL == "/band/songsmanagement/songs") {
      this.songsList();
      // this.getalbumsforsongs();
    } else if (this.currentURL == "/band/songsmanagement/albums") {
      this.getAlbums();
    }
  }
  //error validations
  inputValidationsErrors = (songsForm: any, type: any) => {
    return inputValidations(songsForm, type);
  };

  //pattern validation
  inputPatternValidationsErrors = (form: any, type: any) => {
    return patterntValidations(form, type);
  };

  checkvalidlocation = (songsForm:any, cityName : any): boolean => {
    this.disablelocationSubmit = checklocation(
      songsForm,
      cityName,
      this.formattedaddress,
      this.typedaddress
    );
    return this.disablelocationSubmit;
  };

  checkvalidgenres = (songsForm:any, genre : any): boolean => {
    this.disablegenreSubmit = checkgenres(songsForm,genre,this.genresList);
    return this.disablegenreSubmit;
  };

  // google map package
  public AddressChange(address: Address) {
    console.log(address);
    
     this.formattedaddress=address.formatted_address;
     this.typedaddress=address.formatted_address;
     this.latitude = address.geometry.location.lat()
     this.longitude = address.geometry.location.lng()
  }
  address(data: any){
    this.formattedaddress=data
  }

  cols = [
    { field: "albumart", header: "Poster", index: 1 },
    { field: "title", header: "Title", index: 2 },
    { field: "album", header: "Album Title", index: 3 },
    { field: "duration", header: "Duration ", index: 4 },
    { field: "gener", header: "Genre", index: 5 },
    { field: "city", header: "City", index: 6 },
    { field: "uploadedon", header: "Uploaded on ", index: 7 },
    { field: "live", header: "Live", index: 8 },
    { field: "actions", header: "Actions", index: 9 },
  ];
  songalbumcols = [
    { field: "albumart", header: "Poster", index: 1 },
    { field: "title", header: "Title", index: 2 },
    { field: "duration", header: "Duration ", index: 3 },
    { field: "gener", header: "Genre ", index: 4 },
    { field: "city", header: "City", index: 5 },
    { field: "uploadedon", header: "Uploaded on ", index: 6 },
    { field: "live", header: "Live", index: 7 },
    { field: "actions", header: "Actions", index: 8 },
  ];

  albumcols = [
    { field: "albumart", header: "Albums", index: 1 },
    { field: "title", header: "Title", index: 2 },

    { field: "gener", header: "Genre ", index: 5 },
    { field: "uploadedon", header: "Created on ", index: 6 },
    { field: "live", header: "Live", index: 7 },
    { field: "actions", header: "Actions", index: 8 },
  ];

  //get songs list
  songsList() {
    this.spinner.show();
    let obj = {
      bandId: this.userbandId,
      search: this.searchSong?this.searchSong:"",
      currentPage: this.pageData ? this.pageData.currentPage : 1,
      perPage: this.pageData ? this.pageData.perPage : 10,
    };

    this.bandservice.getSongs(obj).subscribe((res: any) => {
      this.spinner.hide();
      this.songsListData = res.data.data;
      this.totalrecords = this.songsListData[0]?.totalCount;
      this.pageData = res.data.metadata;
      if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        let obj = {
          search: this.searchSong?this.searchSong:"",
          bandId: this.userbandId,
          currentPage: this.pageData ? this.pageData.currentPage-1 : 1,
          perPage: this.pageData ? this.pageData.perPage : 10,
        };
        this.bandservice.getSongs(obj).subscribe((res: any) => {
          this.songsListData = res.data.data;
          this.totalrecords = this.songsListData[0].totalCount;
          this.pageData = res.data.metadata;
          setTimeout(() => {
            this.songpagenator.changePage(this.pageData.currentPage-1)
          }, 0);
        })
      }

    });
  }

//  //albums list for songs
//  getalbumsforsongs() {
 
//    let obj = {
//      userId: this.userbandId,
//      search: this.searchAlbum?this.searchAlbum:'',
//      currentPage: this.albumpageData ? this.albumpageData.currentPage : 1,
//      perPage: this.albumpageData ? this.albumpageData.perPage : 100,
//    };
//    this.bandservice.getAlbums(obj).subscribe((res: any) => {
    
//      this.albumsListData = res.data.albumsList;
//      this.albumpageData = res.data.metadata;
//      this.albumsTotalcount = this.albumsListData[0]?.totalCount;
//      this.albumOptions = this.albumsListData.map((albums) => {
//        return { name: albums.title, code: albums.albumId };
//      });
//    });
//  }
  //songs navigation
  songsNavigation() {
    this.router.navigateByUrl("/band/songsmanagement/songs");
  }

  //fileUpload audio
  uploadAudio(event) {
    this.fileAudio = event.target.files[0];
    this.fileName = this.fileAudio.name;
    this.fileSize = this.fileAudio.size;
    this.fileType = this.fileAudio.type;
    this.songsForm.patchValue({
      title: this?.fileAudio?.name.split(".")[0].slice(0, 30)
    });
    this.showAudiodata = true;
    new Audio(URL.createObjectURL(this.fileAudio)).onloadedmetadata = (
      e: any
    ) => {
      this.duration = e.currentTarget.duration;
      // if(this.duration > 60){
      //   this.minsongduration = false;
      // }
      // else{
      //   this.minsongduration = true;
      // }
    };
  }

  //upload images
  onFileImageupload(event:any) {
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
    this.imgFile = "";
    this.viewImgages = false;
    // this.songInputElement.nativeElement.value = '';
    this.songsForm.get("thumbnail").setValue('');   
  }

  removeAudio() {
    this.showAudiodata = false;
    this.fileAudio = "";
    this.songsForm.get("title").reset();   
    this.songAudioInputElement.nativeElement.value = '';
    // this.minsongduration = false;
  }

  genersSelect(data: any) {
    this.genresList = data.map((a) => a.name);

    if(this.genresList.length > 3){
      this.genremax = true;
    }
    else{
      this.genremax = false;
    }
  }

//upload btn
uploadSongs() {
  this.songsUploadModal = true;
  this.action = "add";
  this.header = "Upload Song";
  this.songsForm.reset();
  this.selectedGeners = [];
  this.removeImg();
  this.removeAudio();

  if (this.currentURL == "/band/songsmanagement/albums/songs") {
    this.songsForm.patchValue({
      albumName: {
        name: this.indivisualAlbumData.albumTitle,
        code: this.indivisualAlbumData.albumId,
      },
    });
  }
}

songsModalClose() {
  this.songsUploadModal = false;
  this.req?.unsubscribe();
  this.isLoading = false;
}

//upoload songs
uploadSong() {
  if (this.songsForm.valid ) {
    const songsForm = { ...this.songsForm };

  } else {
    this.hasError = true;
  }
  this.genresList = this.selectedGeners.map((a: any) => a.name);
  const formData = new FormData();
  formData.append("title", this.songsForm.get("title").value);
  this.genresList?.forEach((item) => formData.append("genres", item));
  formData.append("thumbnail", this.imgFile ? this.imgFile : "");
  formData.append("song", this.fileAudio ? this.fileAudio : "");
  // const location = this.songsForm.get("cityName").value;
  formData.append("cityName", this.formattedaddress.split(",")[0]);
  formData.append("stateName", this.formattedaddress.split(",")[1]);
  formData.append("country", this.formattedaddress.split(",")[2] || null);
  formData.append("latitude", this.latitude ? this.latitude: "");
  formData.append("longitude", this.longitude ? this.longitude : "");
  formData.append(
    "albumId",
    this.songsForm.get("albumName")?.value?.code
      ? this.songsForm.get("albumName")?.value?.code
      : ""
  );
  formData.append("userId", this.userData.id);
  formData.append("bandId",this.userbandId)
  if (this.action === "add") {
    this.isLoading = true;
    this.req = 
    this.bandservice.uploadSong(formData).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.isLoading = false;
      this.songsForm.reset();
      this.removeImg();
      if (this.currentURL == "/band/songsmanagement/albums/songs") {
        this.getindivualAlbumSongs();
      } else if (this.currentURL == "/band/songsmanagement/songs") {
        this.songsList();
      }
      this.imgFile = "";
      this.fileAudio = "";
      this.formattedaddress = "";
      this.latitude = "";
      this.longitude = "";
      this.typedaddress="";
      this.showAudiodata = false;
      this.songsUploadModal = false;
    });
  } else {
    this.isLoading = true;
    this.req = 
    this.bandservice
      .updatSong(this.songsData.id, formData)
      .subscribe((res: any) => {
        this.toastrService.success(res.message);
        //this.spinner.hide();
        this.isLoading = false;
        this.latitude = "";
        this.longitude = "";
        this.songsForm.reset();
        this.removeImg();
        if (this.currentURL == "/band/songsmanagement/albums/songs") {
          this.getindivualAlbumSongs();
        } else if (this.currentURL == "/band/songsmanagement/songs") {
          this.songsList();
        }
        this.showAudiodata = false;
        this.formattedaddress = "";
        this.typedaddress="";
        this.songsUploadModal = false;
      });
  }
}

  //edit song
  updateSong(data: any) {
    this.songsUploadModal = true;
    this.action = "update";
    this.header = "Edit Song";
    this.songsData = data;
    let location = this.songsData?.cityName + ", " + this.songsData?.stateName + (this.songsData?.country?( ", " + this.songsData.country):'');
    var newArr = this.songsData?.genres?.map((value) => {
      return { name: value.genre_name, id: value.id };
    });
    this.selectedGeners = newArr?newArr:[];
    this.showAudiodata = true;
    this.fileAudio = this.songsData?.song;

    if (this.songsData.thumbnail == null) {
      this.imageSrc = "";
      this.viewImgages = false;
    } else {
      this.viewImgages = true;
      this.imageSrc = this.songsData.thumbnail;
      this.imgFile = this.songsData.thumbnail;
    }
    //   this.ImgfileName = this.imgFile.name;

    if (this.currentURL == "/band/songsmanagement/songs") {
      if (!this.songsData?.album) {
      } else {
        this.songsForm.controls["albumName"].setValue({
          name: this.songsData?.album?.title || "",
          code: this.songsData?.album?.id || "",
        });
      }

      if (this.action === "update") {
        this.songsForm.patchValue({
          title: this.songsData?.title,

          cityName:location,
          
        });
        this.formattedaddress = location
        this.typedaddress = location
        this.longitude = this.songsData?.longitude
        this.latitude = this.songsData?.latitude

      } else {
      }
    }

    if (this.currentURL == "/band/songsmanagement/albums/songs") {
      if (this.action === "update") {
        this.songsForm.patchValue({
          title: this.songsData?.title,

          albumName: {
            name: this.indivisualAlbumData?.albumTitle,
            code: this.indivisualAlbumData?.albumId,
          },
          cityName:location,
        });
        this.formattedaddress = location
        this.typedaddress = location
        this.longitude = this.songsData?.longitude
        this.latitude = this.songsData?.latitude
      } else {
      }
    }
  }



  //delete song
  deleteSong(id: any) {
    this.songId = id;

    this.deleteModal = true;
  }
  Delete() {
    this.bandservice.deleteSong(this.songId).subscribe((res: any) => {
      this.toastrService.success(res.message);

      this.deleteModal = false;
      if (this.currentURL == "/band/songsmanagement/albums/songs") {
        this.albumsongspage.currentPage = 1;
        this.getindivualAlbumSongs();
      } else {
        this.songsList();
      }
    });
  }

  closeModal() {
    this.deleteModal = false;
  }

  //live song
  songLive(id: any, live: any) {
    this.liveId = id
    let obj = {
      songId: id,
      live: live,
    };
    this.bandservice.songLive(obj).subscribe((res: any) => {
    });
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
  }

  //albums navigation
  albumsNavigation() {
    this.router.navigateByUrl("/band/songsmanagement/albums");
  }

  //albums songs navigation
  albumsSongsNavigation(data: any) {
    let albumobj: any = {
      albumId: data.albumId,
      albumTitle: data.title,
    };
    localStorage.removeItem("albumData");
    localStorage.setItem("albumData", JSON.stringify(albumobj));
    localStorage.setItem("albumpage", JSON.stringify(this.albumpagenator.currentPage()));
    localStorage.setItem("albumperpage", JSON.stringify(this.albumpageData.perPage));
    this.albumpageData
    if (albumobj) {
      this.router.navigateByUrl("/band/songsmanagement/albums/songs");
    }
  }


  //albumsongs to albums navigation
  songsalbumnavigation(){
    this.router.navigateByUrl("/admin/content-management/albums");
  }
  
  //get albums songs indivual
  getindivualAlbumSongs() {
    this.spinner.show();

    let obj = {
      albumId: this.indivisualAlbumData?.albumId,
      search: this.searchAlbumSong?this.searchAlbumSong:"",
      currentPage: this.albumsongspage ? this.albumsongspage.currentPage : 1,
      perPage: this.albumsongspage ? this.albumsongspage.perPage : 10,
      bandId: this.userbandId,
    };

    this.bandservice.getAlbumSongs(obj).subscribe((res: any) => {
      this.spinner.hide();
      this.albumSongsList = res?.data?.data;
      this.albumsongspage = res?.data?.metadata;
      this.totalcountAlbumSongs = this.albumSongsList[0]?.totalCount;

      if(res.data.data.length == 0  && res.data.metadata.currentPage >= 2){
        let obj = {
          albumId: this.indivisualAlbumData?.albumId,
          search: this.searchAlbumSong?this.searchAlbumSong:"",
          currentPage: this.albumsongspage ? this.albumsongspage.currentPage-1 : 1,
          perPage: this.albumsongspage ? this.albumsongspage.perPage : 10,
          bandId: this.userbandId,
        };
        this.bandservice.getAlbumSongs(obj).subscribe((res: any) => {
          this.songsListData = res.data.data;
          this.totalrecords = this.songsListData[0].totalCount;
          this.pageData = res.data.metadata;
          setTimeout(() => {
            this.albumsongpagenator.changePage(this.albumsongspage.currentPage-1)
          }, 0);
        })
      }
    });
  }

  //upload album
  onFileAlbumImageupload(event) {
    if (event.target.files && event.target.files[0]) {
      this.AlbumimgFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = (e) => (this.albumimageSrc = reader.result);

      reader.readAsDataURL(this.AlbumimgFile);
      this.AlbumviewImgages = true;
    }
  }

  //remove album image
  removealbumImg() {
    this.albumimageSrc = "";
    this.AlbumimgFile = "";
    this.AlbumviewImgages = false;
    this.albumInputElement.nativeElement.value = '';
  }

  //upload album modal
  uploadAlbums() {
    this.albumsUploadModal = true;
    this.action = "add";
    this.header = "Create Album";
    this.albumsForm.reset();
    this.removealbumImg();
  }


  //get albums list
  getAlbums() {
    this.spinner.show();
    this.pageno  = JSON.parse(localStorage.getItem("albumpage"))
    this.perpage  = JSON.parse(localStorage.getItem("albumperpage"))
    let obj = {
      userId: this.userbandId,
      search: this.searchAlbum?this.searchAlbum:'',
      currentPage:this?.pageno?this.pageno:this.albumpageData ? this.albumpageData.currentPage : 1,
      perPage:this?.perpage?this.perpage:this.albumpageData ? this.albumpageData.perPage : 10,
    };
    this.bandservice.getAlbums(obj).subscribe((res: any) => {
      this.albumsListData = res.data.albumsList;
      if(this.pageno){
        setTimeout(() => {
          this.albumpagenator.changePage(this.pageno-1)
          // new this.albumpagenator.onPageChange(false);
        }, 0);
      }
      this.albumpageData = res.data.metadata;
      this.albumsTotalcount = this.albumsListData[0]?.totalCount;
      localStorage.removeItem("albumpage");
      localStorage.removeItem("albumperpage");
      this.spinner.hide();

      if(res.data.albumsList.length == 0  && res.data.metadata.currentPage >= 2){
        let obj = {
          search: this.searchAlbum?this.searchAlbum:'',
          userId: this.userbandId,
          currentPage: this.albumpageData ? this.albumpageData.currentPage-1 : 1,
          perPage: this.albumpageData ? this.albumpageData.perPage : 10,
        };
        this.bandservice.getAlbums(obj).subscribe((res: any) => {
          this.albumsListData = res.data.albumsList;
          this.albumpageData = res.data.metadata;
          this.albumsTotalcount = this.albumsListData[0]?.totalCount;
          setTimeout(() => {
            this.albumpagenator.changePage(this.albumpageData.currentPage-1)
          }, 0);
        })
      }

    });
  }


  //edit album
  updateAlbum(data: any) {
    this.albumsUploadModal = true;
    this.action = "update";
    this.header = "Edit Album";
    this.albumsData = data;
    if (this.action === "update") {
      this.albumsForm.patchValue({
        albumtitle: this.albumsData?.title,
      });
    }

    if (this.albumsData.thumbnail == null) {
      this.AlbumviewImgages = false;
    } else {
      this.AlbumviewImgages = true;
      this.albumimageSrc = this.albumsData.thumbnail;
      this.AlbumimgFile = this.albumsData.thumbnail;
    }
  }

  //albums live
  albumsLive(id, live) {
    let obj = {
      live: live,
    };

    this.bandservice
      .albumLive(obj, id, this.userbandId)
      .subscribe((res: any) => {
      });
  }
  //creatre album
  createAlbum() {
    if (this.albumsForm.valid) {
      const albumsForm = { ...this.albumsForm };
      this.isLoading = true;
    } else {
      this.hasError = true;
    }
      const formData = new FormData();
      formData.append("title", this.albumsForm.get("albumtitle").value);
      formData.append("thumbnail", this.AlbumimgFile ? this.AlbumimgFile : "");
      if (this.action === "add") {
        this.albumreq = 
        this.bandservice
          .createAlbum(formData, this.userbandId)
          .subscribe((res: any) => {
            this.toastrService.success(res.message);
            this.isLoading = false;
            this.getAlbums();
            this.albumsForm.reset();
            this.removealbumImg();
            this.AlbumimgFile = "";
            this.albumsUploadModal = false;
          });
      } else {
        this.albumreq = 
        this.bandservice
          .updateAlbum(this.userbandId, this.albumsData.albumId, formData)
          .subscribe((res: any) => {
            this.toastrService.success(res.message);
            this.isLoading = false;
            this.getAlbums();
            this.albumsForm.reset();
            this.removealbumImg();
            this.albumsUploadModal = false;
          });
      
    }
  }

  //close album modal
  albumsModalClose() {
    this.albumreq?.unsubscribe();
    this.isLoading = false;
    this.albumsUploadModal = false;
    this.removealbumImg();
    this.albumsForm.reset();
  }

  //delete album modal
  deleteAlbums(id: any) {
    this.deleteAlbummodal = true;
    this.albumsDeleteId = id;
  }

  //delete album
  deleteAlbum() {
    this.bandservice
      .deleteAlbum(this.albumsDeleteId, this.userbandId)
      .subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.getAlbums();
        this.deleteAlbummodal = false;
      });
  }

  //close delete album modal
  closeDeleteModal() {
    this.deleteAlbummodal = false;
  }

  //search songs
  searchSongs(event: any) {
    this.searchSong = event.target.value;
    let obj = {
      page : 0,
      rows : this.pageData.perPage?this.pageData.perPage:10
    }
    this.paginate(obj);
  }
  clearsongsearch(){
    this.searchsongtable= "";
    this.searchSongs(this.clearobj)
  }

  //search albums
  searchAlbums(event: any) {
    this.searchAlbum = event.target.value?event.target.value:"";
    let obj = {
      page : 0,
      rows : this.albumpageData.perPage?this.albumpageData.perPage:10
    }
    this.paginateAlbums(obj);  
  }
  clearAlbumsearch(){
    this.searchalbumtable= "";
    this.searchAlbums(this.clearobj)
  }

  //search albums songs
  searchAlbumSongs(event: any) {
    this.searchAlbumSong = event.target.value;
    let obj = {
      page : 0,
      rows : this.albumsongspage.perPage?this.albumsongspage.perPage:10
    }
    this.paginateAlbumsSongs(obj);
  }
  clearAlbumSongssearch(){
    this.searchalbumsongstable= "";
    this.searchAlbumSongs(this.clearobj)
  }

  // songs pagination
  paginate(event) {
    this.spinner.show()
    let data = {
      search: this.searchSong?this.searchSong:"",
      bandId: this.userbandId,
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.bandservice.getSongs(data).subscribe((res: any) => {
      this.songsListData = res.data.data;
      this.pageData = res.data.metadata;
      this.totalrecords = this.songsListData[0]?.totalCount;
      this.spinner.hide()
    });
  }

  //albums pagination
  paginateAlbums(event) {
    this.spinner.show()
    let data = {
      userId: this.userbandId,
      search: this.searchAlbum?this.searchAlbum:'',
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.bandservice.getAlbums(data).subscribe((res: any) => {
      this.albumsListData = res.data.albumsList;
      this.albumpageData = res.data.metadata;
      this.albumsTotalcount = this?.albumsListData[0]?.totalCount?this?.albumsListData[0]?.totalCount:"";
      this.spinner.hide()
    });
  }

  //paginateAlbumsSongs
  paginateAlbumsSongs(event) {
    this.spinner.show()
    let data = {
      albumId: this.indivisualAlbumData.albumId,
      search: this.searchAlbumSong?this.searchAlbumSong:"",
      currentPage: event.page + 1,
      perPage: event.rows,
      bandId: this.userbandId,
    };

    this.bandservice.getAlbumSongs(data).subscribe((res: any) => {
      this.albumsongspage = res?.data?.metadata;
      this.albumSongsList = res?.data?.data;
      this.totalcountAlbumSongs = this.albumSongsList[0]?.totalCount;
      this.spinner.hide()
});
  }
}
