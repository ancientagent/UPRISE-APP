import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from 'src/app/api/services/auth.service';

@Component({
  selector: 'app-login-layout',
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss']
})
export class LoginLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
    this.authservice.signOut();
  }
  logout() {
    this.authservice.signOut();
    this.router.navigateByUrl("/");
  }
}
