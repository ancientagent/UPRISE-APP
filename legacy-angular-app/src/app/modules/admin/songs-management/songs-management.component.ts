import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AdminService } from "src/app/api/services/admin.service";
import { BandService } from "src/app/api/services/band.service";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import {
  checkband,
  checkgenres,
  checklocation,
  patterntValidations,
  inputValidations,
} from "src/app/common/utils";
import * as _ from "lodash";
import { Paginator } from "primeng/paginator/paginator";
import { geners } from "src/app/common/genres";
import { regularExpressions } from "src/app/common/regularexpressions";

@Component({
  selector: "app-songs-management",
  templateUrl: "./songs-management.component.html",
  styleUrls: ["./songs-management.component.scss"],
})
export class SongsManagementComponent implements OnInit {
  @ViewChild("pgsong") songpagenator: Paginator;
  @ViewChild("pgalbum") albumpagenator: Paginator;
  @ViewChild("pgalbumsong") albumsongpagenator: Paginator;
  @ViewChild("songAudioElement", { static: false })
  songAudioInputElement: ElementRef;
  @ViewChild("songThumbnailElement", { static: false })
  songthumbnailElement: ElementRef;
  private geners: any = geners;
  private titleExp: any = regularExpressions.titleExp;
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
  genersOptions: any[];
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
  AlbumviewImgages: boolean = false;
  albumsForm: FormGroup;
  albumsListData: any = [];
  albumsData: any = [];
  albumOptions: any[];
  location: any;
  locationsList: any = [];
  userData: any;
  albumSongsList: any = [];
  albumSongsList1: any = [];
  finalGeners: any = [];
  indivisualAlbumId: any;
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
  albumpageData: any;
  albumsongspage: any;
  indivisualAlbumData: any;
  pageno: any;
  pagesong: boolean = false;
  perpage: any;
  searchsongtable: string;
  searchalbumtable: string;
  searchalbumsongstable: string;
  enteredEmail: any;
  bandUsersList: any;
  userbandId: any;
  userband: any;
  genremax: boolean;
  disablelocationSubmit: boolean;
  errorMessagelocation: string;
  formattedaddress: any;
  typedaddress: any;
  latitude: any;
  longitude: any;
  disablegenreSubmit: boolean;
  req: any;
  useralbumbandId: any;
  disable: boolean = true;
  emptyFilterMessage: any;
  selectedalbumoptions: any[];
  selectedalbum: any;
  useralbumbandtitle: any;
  selectedmail: any;
  errorMessageband: string;
  disablebandSubmit: boolean;
  clearband: boolean = true;
  clearobj: object = { target: { value: "" } };

  constructor(
    private fb: FormBuilder,
    private adminservice: AdminService,
    private bandservice: BandService,
    private toastrService: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.searchSongs = _.debounce(this.searchSongs, 1000);
    this.searchAlbums = _.debounce(this.searchAlbums, 1000);
    this.searchAlbumSongs = _.debounce(this.searchAlbumSongs, 1000);
    this.albumsForm = this.fb.group({
      albumtitle: [
        "",
        [Validators.required, Validators.pattern(this.titleExp)],
      ],
      band: ["", Validators.required],
      avatar: [""],
    });
    this.songsForm = this.fb.group({
      title: ["", [Validators.required, Validators.pattern(this.titleExp)]],
      thumbnail: [""],
      song: [""],
      genre: [[], Validators.required],
      albumName: [""],
      cityName: ["", Validators.required],
      band: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.bandservice.getGenres().subscribe((res: any) => {
      this.genersOptions = res["data"];
    });
    this.currentURL = this.router?.url;
    this.bandservice.buttonloader.subscribe((res) => {
      if (res == true) {
        this.buttonLoading();
      }
    });
    this.bandservice.liveError.subscribe((res) => {
      if (res == true) {
        let liveindex = this.songsListData.findIndex(
          (obj) => obj.id == this.liveId
        );
        this.songsListData[liveindex].live = false;
      }
    });
    if (this.currentURL == "/admin/content-management/songs") {
      this.songsList();
      this.getAlbumsSongs();
    } else if (this.currentURL == "/admin/content-management/albums") {
      this.getAlbums();
    } else if (this.currentURL == "/admin/content-management/albums/songs") {
      this.indivisualAlbumData = JSON.parse(localStorage.getItem("albumData"));
      this.useralbumbandId = JSON.parse(
        localStorage.getItem("useralbumbandId")
      );
      this.useralbumbandtitle = JSON.parse(
        localStorage.getItem("useralbumbandtitle")
      );
      this.getindivualAlbumSongs();
    }
    // this.genersOptions = geners
  }
  //error validations
  inputValidationsErrors = (songsForm: any, type: any) => {
    return inputValidations(songsForm, type);
  };

  //pattern validation
  inputPatternValidationsErrors = (form: any, type: any) => {
    return patterntValidations(form, type);
  };

  cols = [
    { field: "albumart", header: "Poster", index: 1 },
    { field: "title", header: "Title", index: 2 },
    // { field: "album", header: "Album Title", index: 3 },
    { field: "duration", header: "Duration ", index: 4 },
    { field: "gener", header: "Genre", index: 5 },
    { field: "Location", header: "Location", index: 6 },
    { field: "uploadedon", header: "Uploaded on ", index: 7 },
    { field: "live", header: "Live", index: 8 },
    { field: "actions", header: "Actions", index: 9 },
  ];
  songalbumcols = [
    { field: "albumart", header: "Poster", index: 1 },
    { field: "title", header: "Title", index: 2 },
    { field: "duration", header: "Duration ", index: 3 },
    { field: "gener", header: "Genre ", index: 4 },
    { field: "State", header: "State", index: 5 },
    { field: "uploadedon", header: "Uploaded on ", index: 6 },
    { field: "live", header: "Live", index: 7 },
    { field: "actions", header: "Actions", index: 8 },
  ];
  albumcols = [
    { field: "albumart", header: "Albums", index: 1 },
    { field: "title", header: "Title", index: 2 },
    { field: "band", header: "Band Name", index: 3 },
    { field: "gener", header: "Genre ", index: 5 },
    { field: "uploadedon", header: "Created on ", index: 6 },
    { field: "live", header: "Live", index: 7 },
    { field: "actions", header: "Actions", index: 8 },
  ];

  //fileUpload audio
  uploadAudio(event) {
    this.fileAudio = event.target.files[0];
    this.fileName = this.fileAudio.name;
    this.fileSize = this.fileAudio.size;
    this.fileType = this.fileAudio.type;
    this.songsForm.patchValue({
      title: this?.fileAudio?.name.split(".")[0].slice(0, 30),
    });
    this.showAudiodata = true;
    new Audio(URL.createObjectURL(this.fileAudio)).onloadedmetadata = (
      e: any
    ) => {
      this.duration = e.currentTarget.duration;
    };
  }

  //upload images
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
    this.imgFile = "";
    this.viewImgages = false;
    this.songthumbnailElement.nativeElement.value = "";
    this.songsForm.get("thumbnail").reset();
  }
  removeAudio() {
    this.showAudiodata = false;
    this.fileAudio = "";
    this.songsForm.get("title").reset();
    this.songAudioInputElement.nativeElement.value = "";
  }

  //select band
  onSelect(event) {
    this.disable = false;
    this.emptyFilterMessage = "band have no albums";
    this.selectedmail = event.title;
    this.enteredEmail = event.title;
    this.userbandId = event.id;
    this.selectedalbumoptions = this.albumOptions.filter(
      (item) => item.band == event.id
    );
  }
  bandUsersSelect(event) {
    this.clearband = false;
    this.userbandId = "";
    this.songsForm.get("albumName").reset();
    this.disable = true;
    this.enteredEmail = event.query;
    let obj = {
      input: event.query,
    };
    this.adminservice.bandUsersSelect(obj).subscribe((res: any) => {
      this.bandUsersList = res.data;
      this.clearband = true;
    });
  }

  checkvalidband = (songsForm: any, band: any): boolean => {
    this.disablebandSubmit = checkband(
      songsForm,
      band,
      this.selectedmail,
      this.enteredEmail
    );
    return this.disablebandSubmit;
  };

  //get songs list
  songsList() {
    this.spinner.show();
    let obj = {
      search: this.searchSong ? this.searchSong : "",
      currentPage: this.pageData ? this.pageData.currentPage : 1,
      perPage: this.pageData ? this.pageData.perPage : 10,
    };
    this.adminservice.getSongsList(obj).subscribe((res: any) => {
      this.songsListData = res.data.data;
      this.totalrecords = this.songsListData[0]?.totalCount;
      this.pageData = res.data.metadata;
      this.spinner.hide();
      if (res.data.data.length == 0 && res.data.metadata.currentPage >= 2) {
        this.spinner.show();
        let obj = {
          search: this.searchSong ? this.searchSong : "",
          currentPage: this.pageData ? this.pageData.currentPage - 1 : 1,
          perPage: this.pageData ? this.pageData.perPage : 10,
        };
        this.adminservice.getSongsList(obj).subscribe((res: any) => {
          this.songsListData = res.data.data;
          this.totalrecords = this.songsListData[0].totalCount;
          this.pageData = res.data.metadata;
          setTimeout(() => {
            this.songpagenator.changePage(this.pageData.currentPage - 1);
          }, 0);
          this.spinner.hide();
        });
      }
    });
  }

  checkvalidgenres = (songsForm: any, genre: any): boolean => {
    this.disablegenreSubmit = checkgenres(songsForm, genre, this.genresList);
    return this.disablegenreSubmit;
  };

  genersSelect(data: any) {
    this.genresList = data.map((a) => a.name);
    if (this.genresList.length > 3) {
      this.genremax = true;
    } else {
      this.genremax = false;
    }
  }

  checkvalidlocation = (songsForm: any, cityName: any): boolean => {
    this.disablelocationSubmit = checklocation(
      songsForm,
      cityName,
      this.formattedaddress,
      this.typedaddress
    );
    return this.disablelocationSubmit;
  };

  // google map package
  public AddressChange(address: Address) {
    this.formattedaddress = address.formatted_address;
    this.typedaddress = address.formatted_address;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
  }
  address(data: any) {
    this.formattedaddress = data;
  }

  //delete song
  deleteSong(id: any) {
    this.songId = id;

    this.deleteModal = true;
  }
  songsModalClose() {
    this.songsUploadModal = false;
  }
  Delete() {
    this.adminservice.deleteSong(this.songId).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.deleteModal = false;
      if (this.currentURL == "/admin/content-management/albums/songs") {
        this.getindivualAlbumSongs();
      } else {
        this.songsList();
      }
    });
  }

  closeModal() {
    this.deleteModal = false;
  }

  // live song
  songLive(id, live) {
    this.liveId = id;
    let obj = {
      songId: id,
      live: live,
    };
    this.adminservice.songLive(obj).subscribe((res: any) => {
      // this.toastrService.success(res.message);
    });
  }

  //button loader
  buttonLoading() {
    this.isLoading = false;
  }

  //albums navigation
  albumsNavigation() {
    this.router.navigateByUrl("/admin/content-management/albums");
  }
  //songs navigation
  songsNavigation() {
    this.router.navigateByUrl("/admin/content-management/songs");
  }

  //albums songs navigation
  albumsSongsNavigation(data) {
    let albumobj: any = {
      albumId: data.albumId,
      albumTitle: data.title,
    };
    localStorage.removeItem("albumData");
    localStorage.setItem("albumData", JSON.stringify(albumobj));
    localStorage.setItem("useralbumbandId", JSON.stringify(data.band.id));
    localStorage.setItem("useralbumbandtitle", JSON.stringify(data.band.title));
    localStorage.setItem(
      "albumpage",
      JSON.stringify(this.albumpagenator.currentPage())
    );
    localStorage.setItem(
      "albumperpage",
      JSON.stringify(this.albumpageData.perPage)
    );

    if (albumobj) {
      this.router.navigateByUrl("/admin/content-management/albums/songs");
    }
  }

  //albumsongs to albums navigation
  songsalbumnavigation() {
    this.router.navigateByUrl("/admin/content-management/albums");
    this.pageno = JSON.parse(localStorage.getItem("albumData"));
  }

  //get albums list
  getAlbums() {
    this.spinner.show();
    this.pageno = JSON.parse(localStorage.getItem("albumpage"));
    this.perpage = JSON.parse(localStorage.getItem("albumperpage"));

    let obj = {
      search: this.searchAlbum ? this.searchAlbum : "",
      currentPage: this.pageno
        ? this.pageno
        : this.albumpageData
        ? this.albumpageData.currentPage
        : 1,
      perPage: this.perpage
        ? this.perpage
        : this.albumpageData
        ? this.albumpageData.perPage
        : 10,
    };
    this.adminservice.getAlbumsList(obj).subscribe((res: any) => {
      this.albumsListData = res.data.albumsList;
      if (this.pageno) {
        setTimeout(() => {
          this.albumpagenator.changePage(this.pageno - 1);
        }, 0);
      }
      this.albumsTotalcount = this?.albumsListData[0]?.totalCount;
      this.albumpageData = res.data.metadata;
      localStorage.removeItem("albumpage");
      localStorage.removeItem("albumperpage");
      this.spinner.hide();
      if (
        res.data.albumsList.length == 0 &&
        res.data.metadata.currentPage >= 2
      ) {
        let obj = {
          search: this.searchAlbum ? this.searchAlbum : "",
          currentPage: this.albumpageData
            ? this.albumpageData.currentPage - 1
            : 1,
          // currentPage: 1,
          perPage: this.albumpageData ? this.albumpageData.perPage : 10,
        };
        this.adminservice.getAlbumsList(obj).subscribe((res: any) => {
          this.albumsListData = res.data.data;
          this.albumpageData = res.data.metadata;
          this.albumsTotalcount = this.albumsListData[0]?.totalCount;
          setTimeout(() => {
            this.albumpagenator.changePage(this.albumpageData.currentPage - 1);
          }, 0);
        });
      }
    });
  }

  //get albums list
  getAlbumsSongs() {
    let obj = {
      search: "",
      currentPage: 1,
      perPage: 200,
    };
    this.adminservice.getAlbumsList(obj).subscribe((res: any) => {
      this.albumsListData = res.data.albumsList;
      this.albumsTotalcount = this.albumsListData[0]?.totalCount;
      this.albumOptions = this.albumsListData.map((albums) => {
        return {
          name: albums.title,
          code: albums.albumId,
          band: albums.band.id,
        };
      });
    });
  }

  //get albums songs indivual
  getindivualAlbumSongs() {
    this.spinner.show();
    let obj = {
      search: this.searchAlbumSong ? this.searchAlbumSong : "",
      albumId: this.indivisualAlbumData?.albumId,
      currentPage: this.albumsongspage ? this.albumsongspage.currentPage : 1,
      perPage: this.albumsongspage ? this.albumsongspage.perPage : 10,
    };
    this.adminservice.getAlbumSongs(obj).subscribe((res: any) => {
      this.spinner.hide();
      this.albumSongsList = res?.["data"]["data"];
      this.totalcountAlbumSongs = this.albumSongsList[0]?.totalCount;
      this.albumsongspage = res?.data?.metadata;

      if (res.data.data.length == 0 && res.data.metadata.currentPage >= 2) {
        let obj = {
          albumId: this.indivisualAlbumData?.albumId,
          search: this.searchAlbumSong ? this.searchAlbumSong : "",
          currentPage: this.albumsongspage
            ? this.albumsongspage.currentPage - 1
            : 1,
          // currentPage: 1,
          perPage: this.albumsongspage ? this.albumsongspage.perPage : 10,
        };
        this.bandservice.getAlbumSongs(obj).subscribe((res: any) => {
          this.songsListData = res.data.data;
          this.totalrecords = this.songsListData[0].totalCount;
          this.pageData = res.data.metadata;
          setTimeout(() => {
            this.albumsongpagenator.changePage(
              this.albumsongspage.currentPage - 1
            );
          }, 0);
        });
      }
    });
  }

  //remove album image
  removealbumImg() {
    this.albumimageSrc = "";

    this.AlbumviewImgages = false;
  }

  //upload album modal
  uploadAlbums() {
    this.albumsUploadModal = true;
    this.action = "add";
    this.header = "Upload Album";
    this.albumsForm.reset();
    this.removealbumImg();
  }

  // albums live
  albumsLive(id, live) {
    let obj = {
      live: live,
    };
    this.adminservice.albumLive(obj, id).subscribe((res: any) => {});
  }

  //close album modal
  albumsModalClose() {
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
    this.adminservice.deleteAlbum(this.albumsDeleteId).subscribe((res: any) => {
      this.toastrService.success(res.message);
      this.getAlbums();
      this.deleteAlbummodal = false;
    });
  }

  //close delete album modal
  closeDeleteModal() {
    this.deleteAlbummodal = false;
  }
  // clear band search input
  clearbandsearch(data) {
    this.songsForm.get(data).reset();
  }

  // search songs
  searchSongs(event: any) {
    this.searchSong = event.target.value;
    let obj = {
      page: 0,
      rows: this.pageData.perPage,
    };
    this.paginate(obj);
  }
  clearsongsearch() {
    this.searchsongtable = "";
    this.searchSongs(this.clearobj);
  }

  //search albums
  searchAlbums(event: any) {
    this.searchAlbum = event.target.value;
    let obj = {
      page: 0,
      rows: this.albumpageData.perPage,
    };
    this.paginateAlbums(obj);
  }
  clearAlbumsearch() {
    this.searchalbumtable = "";
    this.searchAlbums(this.clearobj);
  }

  //search albums songs
  searchAlbumSongs(event: any) {
    this.searchAlbumSong = event.target.value;
    let obj = {
      page: 0,
      rows: this.albumsongspage.perPage,
    };
    this.paginateAlbumsSongs(obj);
  }
  clearAlbumSongssearch() {
    this.searchalbumsongstable = "";
    this.searchAlbumSongs(this.clearobj);
  }

  // songs pagination
  paginate(event) {
    this.spinner.show();
    let data = {
      search: this.searchSong ? this.searchSong : "",
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.adminservice.getSongsList(data).subscribe((res: any) => {
      this.songsListData = res.data.data;
      this.pageData = res.data.metadata;
      this.totalrecords = this.songsListData[0]?.totalCount;
      this.spinner.hide();
    });
  }

  //albums pagination
  paginateAlbums(event) {
    this.spinner.show();
    let data = {
      search: this.searchAlbum ? this.searchAlbum : "",
      currentPage: event.page + 1,
      perPage: event.rows,
    };

    this.adminservice.getAlbumsList(data).subscribe((res: any) => {
      this.albumsListData = res.data.albumsList;
      this.albumpageData = res.data.metadata;
      this.albumsTotalcount = this.albumsListData[0]?.totalCount;
      this.spinner.hide();
    });
  }

  //paginateAlbumsSongs
  paginateAlbumsSongs(event) {
    this.spinner.show();
    this.indivisualAlbumId = localStorage.getItem("albumId");
    let data = {
      albumId: this.indivisualAlbumData?.albumId,
      currentPage: event.page + 1,
      search: this.searchAlbumSong ? this.searchAlbumSong : "",
      perPage: event.rows,
    };

    this.adminservice.getAlbumSongs(data).subscribe((res: any) => {
      this.albumSongsList = res?.data?.data;
      this.albumsongspage = res?.data?.metadata;
      this.totalcountAlbumSongs = this.albumSongsList[0]?.totalCount;
      this.spinner.hide();
    });
  }

  //edit song
  updateSong(data: any) {
    this.songsUploadModal = true;
    this.songsForm.reset();
    this.disable = false;
    this.action = "update";
    this.header = "Edit Song";
    this.songsData = data;
    let location = this.songsData?.cityName + ", " + this.songsData?.stateName + (this.songsData?.country?( ", " + this.songsData.country):'');
    var newArr = this.songsData?.genres?.map((value) => {
      return { name: value.genre_name, id: value.id };
    });
    this.selectedGeners = newArr ? newArr : [];
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
    this.formattedaddress = location;
    this.typedaddress = location;
    this.longitude = this.songsData?.longitude;
    this.latitude = this.songsData?.latitude;
    this.selectedalbumoptions = this.albumOptions?.filter(
      (item) => item.band == this.songsData?.band.id
    );
    this.songsForm.patchValue({
      title: this.songsData?.title,
      cityName: location,
      band: this.songsData?.band,
    });
    this.userbandId = this.songsData?.band?.id;
    this.songsForm.controls["albumName"].setValue({
      name: this.songsData?.album?.title || "",
      code: this.songsData?.album?.id || "",
      band: this.songsData?.band?.id,
    });

    if (this.currentURL == "/admin/content-management/albums/songs") {
      let obj = {
        id: this.useralbumbandId,
        title: this.useralbumbandtitle,
      };
      this.songsForm.patchValue({
        band: obj,
      });
    }
  }

  //upoload songs
  uploadSong() {
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
    formData.append("latitude", this.latitude ? this.latitude : "");
    formData.append("longitude", this.longitude ? this.longitude : "");
    formData.append(
      "albumId",
      this.songsForm.get("albumName")?.value?.code
        ? this.songsForm.get("albumName")?.value?.code
        : ""
    );
    formData.append("userId", this.userData.id);
    if (this.currentURL == "/admin/content-management/albums/songs") {
      formData.append("bandId", this.useralbumbandId);
    } else if (this.currentURL == "/admin/content-management/songs") {
      formData.append("bandId", this.userbandId);
    }
    if (this.action === "add") {
      this.isLoading = true;
      this.req = this.bandservice.uploadSong(formData).subscribe((res: any) => {
        this.toastrService.success(res.message);
        this.isLoading = false;
        this.songsForm.reset();
        this.removeImg();
        if (this.currentURL == "/admin/content-management/albums/songs") {
          this.getindivualAlbumSongs();
        } else if (this.currentURL == "/admin/content-management/songs") {
          this.songsList();
        }
        this.imgFile = "";
        this.fileAudio = "";
        this.formattedaddress = "";
        this.latitude = "";
        this.longitude = "";
        this.typedaddress = "";
        this.showAudiodata = false;
        this.songsUploadModal = false;
      });
    } else {
      this.isLoading = true;
      this.req = this.bandservice
        .updatSong(this.songsData.id, formData)
        .subscribe((res: any) => {
          this.toastrService.success(res.message);
          this.isLoading = false;
          this.latitude = "";
          this.longitude = "";
          this.songsForm.reset();
          this.removeImg();
          if (this.currentURL == "/admin/content-management/albums/songs") {
            this.getindivualAlbumSongs();
          } else if (this.currentURL == "/admin/content-management/songs") {
            this.songsList();
          }
          this.showAudiodata = false;
          this.formattedaddress = "";
          this.typedaddress = "";
          this.songsUploadModal = false;
        });
    }
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
    formData.append(
      "thumbnail",
      this.AlbumimgFile
        ? this.AlbumimgFile
        : this.albumimageSrc
        ? this.albumimageSrc
        : ""
    );

    if (this.action === "add") {
      this.userbandId = this.albumsForm.get("band").value.id;
      this.bandservice
        .createAlbum(formData, this.userbandId)
        .subscribe((res: any) => {
          this.toastrService.success(res.message);
          this.getAlbums();
          this.albumsForm.reset();
          this.removealbumImg();
          this.AlbumimgFile = "";
          this.albumsUploadModal = false;
          this.isLoading = false;
        });
    } else {
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

  // edit album
  updateAlbum(data: any) {
    this.albumsUploadModal = true;
    this.albumsForm.reset();
    this.action = "update";
    this.header = "Edit Album";
    this.albumsData = data;
    if (this.action === "update") {
      this.albumsForm.patchValue({
        albumtitle: this.albumsData?.title,
        band: this.albumsData.band,
      });
      (this.userbandId = this.albumsData?.band.id),
        (this.userband = this.albumsData?.band.title);
    }

    if (this.albumsData.thumbnail == null) {
      this.AlbumviewImgages = false;
    } else {
      this.AlbumviewImgages = true;
      this.albumimageSrc = this.albumsData.thumbnail;
    }
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

  //upload btn
  uploadSongs() {
    this.disable = true;
    this.songsUploadModal = true;
    this.action = "add";
    this.header = "Upload Song";
    this.songsForm.reset();
    this.selectedGeners = [];
    this.removeImg();
    this.removeAudio();
    if (this.currentURL == "/admin/content-management/albums/songs") {
      this.songsForm.patchValue({
        albumName: {
          name: this.indivisualAlbumData.albumTitle,
          code: this.indivisualAlbumData.albumId,
        },
      });
      let obj = {
        id: this.useralbumbandId,
        title: this.useralbumbandtitle,
      };
      this.songsForm.patchValue({
        band: obj,
      });
    }
  }
}
