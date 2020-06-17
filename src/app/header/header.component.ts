import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthService} from '../users/Auth/auth.service';
import {outputs} from '@syncfusion/ej2-angular-richtexteditor/src/rich-text-editor/richtexteditor.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  activeIndex: string;
  private isLogged = false;
  @Output() loggedEmitter = new EventEmitter();
  private role;

  constructor(public authService: AuthService) {
    authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
    this.isLogged = authService.isLoggedIn;
    this.activeIndex = window.location.pathname.substr(1) || 'main';
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
    this.isLogged = false;
    this.role = 'guest';
    this.loggedEmitter.emit(this.isLogged);
    this.activeIndex = 'main';
  }

  isVisible(roles) {
    if (this.authService.isLoggedIn && !this.isLogged) { // detect logging in
      this.authService.getWebsiteRole().subscribe(data => {
        this.role = data.body['role'];
      });
      this.isLogged = true;
    }
    return roles.includes(this.role);
  }

  setActive(index) {
    this.activeIndex = index;
  }
}
