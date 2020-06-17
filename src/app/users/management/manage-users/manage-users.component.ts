import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {TakenValidator} from '../../../utilities/custom-validators/taken-validator';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  addUserForm: FormGroup;
  private role;
  allAvailableUsers = [];
  allUsers = [];
  filteredUsers = [];
  filteredAllUsers = [];

  constructor(private fb: FormBuilder,
              public authService: AuthService,
              private mds: ManagementDataService,
              private titleService: Title,
              private toastService: ToastService) {
    titleService.setTitle('Manage users');
    this.addUserForm = fb.group({
      username: new FormControl('',
        [Validators.required,
          Validators.pattern('^[a-z\u0590-\u05feA-Z0-9]+$'),
          Validators.minLength(3),
          Validators.maxLength(15)
        ],
        [TakenValidator(this.mds, 'username', '')])
    });
    authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
    this.mds.getAllAvailableUsers().subscribe(data => {
      if (data.body['content']) {
        this.allAvailableUsers = data.body['content'].split(',');
      }
      this.filteredUsers = this.allAvailableUsers;
    }, error => this.toastService.showDanger(error.error.message));

    mds.getAllUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.allUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
        this.filteredAllUsers = this.allUsers;
      }
    }, error => this.toastService.showDanger(error.error.message));
  }

  public getRole() {
    return this.role;
  }

  ngOnInit(): void {

  }

  registerUser() {
    this.authService.register(this.addUserForm.value.username).subscribe((res) => {
      if (res.message) {
        this.toastService.showSuccess(`${this.addUserForm.value.username}: ${res.message}`);
        this.addUserForm.reset();
      }
    }, error => this.toastService.showDanger(error));
  }

  resetPassword(user) {
    this.mds.resetPassword(user).subscribe(data => {
      this.allAvailableUsers = this.allAvailableUsers.filter((elm) => elm !== user);
      if (data.body['message']) {
        this.toastService.showSuccess(`${user}: ${data.body['message']}`);
      }
    }, error => this.toastService.showDanger(error.error.message));
  }

  isVisible(roles) {
    return roles.includes(this.role);
  }

  filterUsers(value: string) {
    if (!value) {
      this.filteredUsers = this.allAvailableUsers;
    }
    this.filteredUsers = Object.assign([], this.allAvailableUsers).filter(
      item => item.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }

  filterAllUsers(value: string) {
    if (!value) {
      this.filteredAllUsers = this.allUsers;
    }
    this.filteredAllUsers = Object.assign([], this.allUsers).filter(
      item => item.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
}
