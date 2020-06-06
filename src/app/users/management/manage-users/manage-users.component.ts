import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {TakenValidator} from '../../../utilities/custom-validators/taken-validator';

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
  usernameToResetPassword;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private mds: ManagementDataService) {
    this.addUserForm = fb.group({
      username: new FormControl('', [Validators.required], [TakenValidator(this.mds, 'username')])
    });
    authService.getWebsiteRole().subscribe(data => this.role = data.body['role']);
    this.mds.getAllAvailableUsers().subscribe(data => {
      if (data.body['content']) {
        this.allAvailableUsers = data.body['content'].split(',');
      }
    });

    mds.getAllUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.allUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    });
  }

  public getRole() {
    return this.role;
  }

  ngOnInit(): void {

  }

  registerUser() {
    this.authService.register(this.addUserForm.value.username).subscribe((res) => {
      if (res.message) {
        alert(res.message);
        this.addUserForm.reset();
      }
    }, error => console.log(error));
  }

  resetPassword() {
    this.mds.resetPassword(this.usernameToResetPassword).subscribe(data => {
      if (data.body['message']) {
        alert(data.body['message']);
      }
    }, error => alert(error.error.message));
  }

  isVisible(roles) {
    return roles.includes(this.role);
  }
}
