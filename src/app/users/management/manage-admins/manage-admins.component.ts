import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.css']
})
export class ManageAdminsComponent implements OnInit {
  allAdmins = [];
  availableUsers = [];
  allUsers = [];

  constructor(private mds: ManagementDataService,
              public authService: AuthService,
              private titleService: Title,
              private toastService: ToastService) {

    titleService.setTitle('Manage admins');
    mds.getAllAdmins().subscribe((data: any) => {
      if (data.body.content) {
        this.allAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => {
      this.toastService.showDanger(error.error.message);
    });
    mds.getAllAvailableUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.availableUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => this.toastService.showDanger(error.error.message));
    mds.getAllUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.allUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => this.toastService.showDanger(error.error.message));
  }

  ngOnInit(): void {
  }

  addAdmin(newAdmin) {
    if (newAdmin && (this.availableUsers.includes(newAdmin))) {
      this.mds.registerAdmin(newAdmin).subscribe(data => {
        this.toastService.showSuccess(`${newAdmin}: ${data.body['message']}`);
        this.allAdmins.push(newAdmin);
      }, error => {
        this.toastService.showDanger(newAdmin + ': ' + error.error.message);
      });
    } else {
      this.toastService.showDanger(newAdmin + ': user not available');
    }
  }

  removeAdmin(adminToRemove) {
    if (adminToRemove && this.allAdmins.includes(adminToRemove)) {
      this.mds.removeAdmin(adminToRemove).subscribe(data => {
        this.toastService.showSuccess(`${adminToRemove}: ${data.body['message']}`);
        this.allAdmins = this.allAdmins.filter(u => u !== adminToRemove);
      }, error => {
        this.toastService.showDanger(adminToRemove + ': ' + error.error.message);
      });
    } else {
      this.toastService.showDanger(adminToRemove + ': user isn\'t admin');
    }
  }

  removeUser(userToDelete) {
    this.mds.removeUser(userToDelete).subscribe(data => {
      this.toastService.showSuccess(`${userToDelete}: ${data.body['message']}`);
      this.allUsers = this.allUsers.filter(user => user !== userToDelete);
    }, error => {
      this.toastService.showDanger(userToDelete + ': ' + error.error.message);
    });
  }

  resetPassword(user) {
    this.mds.resetPassword(user).subscribe(data => {
      if (data.body['message']) {
        this.toastService.showSuccess(`${user}: ${data.body['message']}`);
        this.availableUsers = this.availableUsers.filter(u => u !== user);
      }
    }, error => {
      this.toastService.showDanger(user + ': ' + error.error.message);
    });
  }
}
