import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/api/services/auth.service';

@Component({
  selector: 'app-login-message',
  templateUrl: './login-message.component.html',
  styleUrls: ['./login-message.component.scss']
})
export class LoginMessageComponent implements OnInit {

  constructor(
    private router: Router,
    private authservice: AuthService
  ) { }

  ngOnInit(): void {
  }
  login() {
    this.authservice.signOut();
    this.router.navigateByUrl("/signIn");
  }
}
