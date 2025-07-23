import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class AdminService {
  private baseUrl: string = environment.API_URL;
  private google_api_key: any = environment.GOOGLE_API_KEY;

  constructor(private http: HttpClient, private router: Router) {}

  //get users list
  getUsersList(data) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set("search", data.search);

    return this.http.get(this.baseUrl + "admin/users/list", {
      params: params,
    });
  }

  // update user
  updateDetails(id: any, data: any) {
    return this.http.put(this.baseUrl + `admin/update_user/${id}`, data);
  }

  //get events list
  getEventsList(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set("search", data.search);
    return this.http.get(this.baseUrl + "eventmanagement/admin/events-list", {
      params: params,
    });
  }

  //delete event
  deleteEvent(id: any, data: any) {
    return this.http.delete(this.baseUrl + `eventmanagement/event/${id}`, {
      body: data,
    });
  }

  //delete ads
  deleteAds(id: any, data: any) {
    return this.http.delete(this.baseUrl + `admin/banner/${id}`, {
      body: data,
    });
  }

  //delete user
  deleteUser(id: any) {
    return this.http.delete(this.baseUrl + `admin/user/${id}`);
  }

  //delete song
  deleteSong(songId:any){
    return this.http.delete(this.baseUrl + `admin/song/${songId}`);
  }

  //delete album
  deleteAlbum(albumsDeleteId:any){
    return this.http.delete(this.baseUrl + `admin/album/${albumsDeleteId}`);
  }

  //search users
  searchUsers(data: any) {
    let params = new HttpParams();
    params = params
    .set("currentPage", data.currentPage)
    .set("perPage", data.perPage)
    .set("search", data.search);

    return this.http.get(this.baseUrl + "admin/users/list", {
      params: params,
    });
  }

  //search events
  searchEvents(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set("search", data.search);
    return this.http.get(this.baseUrl + "eventmanagement/admin/events-list", {
      params: params,
    });
  }

  //create ads
  createAds(data: any) {
    return this.http.post(this.baseUrl + "admin/create_banner", data);
  }

  //search events
  searchads(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set("search", data.search)
      .set('bands',data.bands.toString());
    return this.http.get(this.baseUrl + "admin/banners", {
      params: params,
    });
  }

  //get events list
  getAdsList(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set('bands',data.bands.toString())
      .set("search", data.search);
    return this.http.get(this.baseUrl + "admin/banners",{
      params: params,
    });
  }

  // block ad
  blockad(data){
    return this.http.put(this.baseUrl + "admin/banners/blocked", data)

  }
  
  //get songs list
  getSongsList(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "admin/songs-list", { params: params });
  }
  //get locations
  getLocations(data: any) {
    let params = new HttpParams();
    params = params
      .set("input", data.input)
      .set("types", data.types)
      .set("key", this.google_api_key);
    return this.http.get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json",
      { params: params }
    );
  }

  //get albums listadmin/albums-list?currentPage=1&perPage=1&search=u
  getAlbumsList(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "admin/albums-list", {
      params: params,
    });
  }

  //get albums songs lis
  getAlbumSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("albumId", data.albumId)
      .set("currentPage", data.currentPage)
      .set("search", data.search)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + `admin/album-songs`, {
      params: params,
    });
  }

  //activateUser
  activateUser(id: any) {
    return this.http.put(this.baseUrl + `admin/active-user/${id}`, {});
  }

  //song search
  searchSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "admin/songs-list", {
      params: params,
    });
  }

  // search songs
  searchAlbums(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "admin/albums-list", {
      params: params,
    });
  }

  // search albums songs
  searchAlbumSongs(data:any){
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("albumId", data.albumId)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + `admin/album-songs`, {
      params: params,
    });
  }

  // song live
  songLive(data: any) {
    return this.http.put(this.baseUrl + "song/live", data);
  }

  // song live
  adLive(data: any) {
    return this.http.put(this.baseUrl + "admin/banner_live", data);
  }
  
  // enable promo
  promo(data: any){
    return this.http.put(
      this.baseUrl + `admin/band/promos-enabled`,
      data
    );
  }

  //album  live
  albumLive(data: any, albumId: any) {
    return this.http.put(
      this.baseUrl + `band/live_album/${albumId}`,
      data
    );
  }

  // bandUsersSelect
  bandUsersSelect(data){
    let params = new HttpParams();
    params = params.set("search", data.input);
    return this.http.get(this.baseUrl + "admin/band_list", {
      params: params,
    });
  }

  // get bands for ads
  getBands(){
    return this.http.get(this.baseUrl + "admin/banner/bands")
  }

  // stastics
  getStatastics(data){
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage||1)
      .set("perPage", data.perPage||10)
      .set("bandId", data.bandId||'')
    if(data.upvotes){
      params = params.set("upvotes", data.upvotes)
    }
    else if(data.downvotes){
      params = params.set("downvotes", data.downvotes)
    }
    else if(data.blasts){
      params = params.set("blasts", data.blasts)
    }
    return this.http.get(this.baseUrl+"admin/statistics/songs", {
      params: params,
    })
  }
}
