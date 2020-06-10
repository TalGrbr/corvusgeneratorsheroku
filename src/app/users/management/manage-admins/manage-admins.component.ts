import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {AuthService} from '../../Auth/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.css']
})
export class ManageAdminsComponent implements OnInit {
  allAdmins = [];
  availableUsers = [];
  allUsers = [];

  constructor(private mds: ManagementDataService, public authService: AuthService, private router: Router) {
    mds.getAllAdmins().subscribe((data: any) => {
      if (data.body.content) {
        this.allAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => {
      console.log(error.error.message);
    });
    mds.getAllAvailableUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.availableUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
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

  ngOnInit(): void {
  }

  addAdmin(newAdmin) {
    if (newAdmin && (this.availableUsers.includes(newAdmin))) {
      this.mds.registerAdmin(newAdmin).subscribe(data => {
        alert(data.body['message']);
        this.allAdmins.push(newAdmin);
      }, error => alert(error.error.message));
    } else {
      alert('user not available');
    }
  }

  removeAdmin(adminToRemove) {
    if (adminToRemove && this.allAdmins.includes(adminToRemove)) {
      this.mds.removeAdmin(adminToRemove).subscribe(data => {
        alert(data.body['message']);
        this.allAdmins = this.allAdmins.filter(u => u !== adminToRemove);
      }, error => {
        alert(error.error.message);
      });
    } else {
      alert('User isn\'t admin');
    }
  }

  removeUser(userToDelete) {
    this.mds.removeUser(userToDelete).subscribe(data => {
      alert(data.body['message']);
      this.allUsers = this.allUsers.filter(user => user !== userToDelete);
    }, error => alert(error.error.message));
  }

  resetPassword(user) {
    this.mds.resetPassword(user).subscribe(data => {
      if (data.body['message']) {
        alert(data.body['message']);
        this.availableUsers = this.availableUsers.filter(u => u !== user);
      }
    }, error => alert(error.error.message));
  }
}
