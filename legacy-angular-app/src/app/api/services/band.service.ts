import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class BandService {
  private baseUrl: string = environment.API_URL;
  private google_api_key: any = environment.GOOGLE_API_KEY;
  constructor(private http: HttpClient, private router: Router) {}

  // button loading
  buttonloader = new EventEmitter<any>();

  // song live error
  liveError = new EventEmitter<any>();

  //songs upload
  uploadSong(data: any) {
    return this.http.post(this.baseUrl + "song/upload", data);
  }

  //get songs list
  SongsList(data: any) {
    let params = new HttpParams();
    params = params.set("bandId", data.bandId);
    return this.http.get(this.baseUrl + "song/songs-list", {
      params: params,
    });
  }
  avatars(){
    return this.http.get(this.baseUrl + "auth/avatars");
  }
  //delete song
  deleteSong(id: any) {
    return this.http.delete(this.baseUrl + `song/${id}`);
  }
  //update song
  updatSong(id: any, data: any) {
    return this.http.put(this.baseUrl + `song/edit/${id}`, data);
  }
  // song live
  songLive(data: any) {
    return this.http.put(this.baseUrl + "song/live", data);
  }

  //get band id
  getBandId() {
    return this.http.get(this.baseUrl + "user/band");
  }
  //get bandlist
  getBandList() {
    return this.http.get(this.baseUrl + "bandmember/list");
  }

  //invite bandMember
  addBandMember(data: any) {
    return this.http.post(this.baseUrl + "bandmember/invite", data);
  }

  //get events
  getEventsData(data: any) {
    let params = new HttpParams();
    params = params
      .set("search", data.search)
      .set("bandId", data.bandId)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "eventmanagement/events-list", {
      params: params,
    });
  }

  //create event
  createEvent(data: any) {
    return this.http.post(this.baseUrl + "eventmanagement/create-event", data);
  }

  //delete Event
  deleteEvent(id: any, data: any) {
    return this.http.delete(this.baseUrl + `eventmanagement/event/${id}`, {
      body: data,
    });
  }

  //create ads
  createAds(data: any) {
    return this.http.post(this.baseUrl + "banner/create_banner", data);
  }
  
  //get events list
  getAdsList(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("bandId", data.bandId)
      .set("perPage", data.perPage)
      .set("search", data.search);
    return this.http.get(this.baseUrl + "banner/list_banners", 
    {
      params: params,
    }
    );
  }

  // song live
  adLive(data: any) {
    return this.http.put(this.baseUrl + "banner/live", data);
  }


  //delete event
  deleteAds(id: any, data: any) {
    return this.http.delete(this.baseUrl + `banner/${id}`, {
      body: data,
    });
  }

  //update event
  updateAd(id: any, data: any) {
    return this.http.put(
      this.baseUrl + `banner/${id}`,
      data
    );
  }

  //update event
  updateEvent(id: any, data: any) {
    return this.http.put(
      this.baseUrl + `eventmanagement/update-event/${id}`,
      data
    );
  }

  //get locations
  // getLocations(data: any) {
  //   const par = '{country : "us"}'
  //   let params = new HttpParams();
  //   params = params
      // .set("input", data.input)
      // .set("componentRestrictions", '{country : us}')
      // .set("types", "(cities)")
      // // .set("libraries" , "places")
      // .set("region", "us")
      // // .set("sensor",false)
      // .set("country","us")
      // .set("key", this.google_api_key)
      // // .set("bounds", "circle.getBounds()")
      // // .set("strictbounds", true );
  //   return this.http.get(
  //     "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  //     // https://maps.googleapis.com/maps/api/place/autocomplete/json?input=110%20Ward&location=40.7128%2C-74.0059&radius=500&types=address&components=country%3ACA%7Ccountry%3AUS&key=YOUR_API_KEY
  //     { params: params }
  //   );
  // }

  //get locations
  getLocations(data: any) {
    let params = new HttpParams();
    params = params
      .set("input", data.input)
      .set("types", data.types)
      .set("region", "us")
      .set("key", this.google_api_key)
      .set("componentRestrictions", '{country : us}');
    return this.http.get(this.baseUrl + "places",{ params: params });
  }

  //get band details
  getBandDetails(data: any) {
    let params = new HttpParams();
    params = params.set("bandId", data);
    return this.http.get(this.baseUrl + "band/band_details", {
      params: params,
    });
  }

  //update band poster
  updateBandDetails(data: any) {
    return this.http.put(this.baseUrl + "band/edit_band", data);
  }

  //get band members
  getBandMember(data: any) {
    let params = new HttpParams();
    params = params.set("bandId", data);

    return this.http.get(this.baseUrl + "band/bandmembers_list", {
      params: params,
    });
  }

  //inviteBandMember
  inviteBandMember(data: any) {
    return this.http.post(this.baseUrl + "bandmember/invite", data);
  }

  //upload gallery
  uploadGallery(data: any) {
    return this.http.post(this.baseUrl + "band/upload_images", data);
  }

  //get gallery
  getGallery(data: any) {
    let params = new HttpParams();
    params = params.set("bandId", data);
    return this.http.get(this.baseUrl + "band/band_images", {
      params: params,
    });
  }

  //delete gallery
  deleteGallery(id, data: any) {
    let params = new HttpParams();
    params = params.set("bandId", id);
    return this.http.delete(this.baseUrl + "band/delete_images", {
      body: data,
      params: params,
    });
  }
  removebandmember(band:any,id:any){
    return this.http.delete(this.baseUrl + "band/"+ band +"/bandmember/"+ id );
  }

  //get band members auto search
  bandUsersSelect(data: any) {
    let params = new HttpParams();
    params = params.set("bandId", data.bandId).set("search", data.input);

    return this.http.get(this.baseUrl + "band/members", {
      params: params,
    });
  }

  //update user profile
  updateUserProfile(data: any) {
    return this.http.put(this.baseUrl + "user/update_profile", data);
  }
  //create album
  createAlbum(data: any, id: any) {
    return this.http.post(this.baseUrl + `band/${id}/album`, data);
  }

  //update album
  updateAlbum(id: any, albumid: any, data: any) {
    return this.http.put(
      this.baseUrl + `band/${id}/update_album/${albumid}`,
      data
    );
  }

  //get album names
  getAlbumNames(data: any) {
    return this.http.get(this.baseUrl + `band/${data}/albums`);
  }

  //get albums
  getAlbums(data: any) {
    let params = new HttpParams();
    params = params
      .set("currentPage", data.currentPage)
      .set("search", data.search)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + `band/${data.userId}/list_albums`, {
      params: params,
    });
  }

  //get albums songs list?bandId=1&albumId=1&currentPage=1&perPage=20
  getAlbumSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("albumId", data.albumId)
      .set("bandId", data.bandId)
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);

    return this.http.get(this.baseUrl + `song/songs-list`, {
      params: params,
    });
  }

  //album  live
  albumLive(data: any, albumId: any, bandId: any) {
    return this.http.put(this.baseUrl + `band/live_album/${albumId}`, data);
  }

  //delete album
  deleteAlbum(albumId: any, id: any) {
    return this.http.delete(
      this.baseUrl + `band/${id}/delete_album/${albumId}`
    );
  }

  //search songs
  searchSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("bandId", data.bandId)
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "song/songs-list", {
      params: params,
    });
  }
  //search eventshttp://localhost:3000/eventmanagement/events-list?bandId=1&currentPage=1&perPage=10&search=g
  searchEvents(data: any) {
    let params = new HttpParams();
    params = params
      .set("bandId", data.bandId)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage)
      .set("search", data.search);
    return this.http.get(this.baseUrl + "eventmanagement/events-list", {
      params: params,
    });
  }

  //search album
  searchAlbums(data: any) {
    let params = new HttpParams();
    params = params

      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + `band/${data.bandId}/list_albums`, {
      params: params,
    });
  }

  //search album songs
  searchAlbumSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("albumId", data.albumId)
      .set("bandId", data.bandId)
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + `song/songs-list`, {
      params: params,
    });
  }

  //pagination
  getSongs(data: any) {
    let params = new HttpParams();
    params = params
      .set("bandId", data.bandId)
      .set("search", data.search)
      .set("currentPage", data.currentPage)
      .set("perPage", data.perPage);
    return this.http.get(this.baseUrl + "song/songs-list", {
      params: params,
    });
  }
  getGenres(){
    return this.http.get(this.baseUrl + "auth/genres")
  }
  // change password
  changePassword(data:any){
    return this.http.put(this.baseUrl + "user/change-password",data)
  }
}
