import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/api/services/auth.service';

@Component({
  selector: 'app-register-success',
  templateUrl: './register-success.component.html',
  styleUrls: ['./register-success.component.scss']
})
export class RegisterSuccessComponent implements OnInit {
  success:boolean=false;
  error:boolean=false;
  constructor(private authservice: AuthService) { }

  ngOnInit(): void {    
    var currentUrl = window.location.search;
    const params = new URLSearchParams(currentUrl);    
    this.authservice.status(params.get("token")).subscribe((res)=>{
      this.success=true
    });
    this.authservice.registerError.subscribe((res) => {
      if (res == true) {
        this.error=res;
      }
    });
  }
}
