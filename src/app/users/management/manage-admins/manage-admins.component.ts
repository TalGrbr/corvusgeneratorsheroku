import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';

@Component({
  selector: 'app-manage-admins',
  templateUrl: './manage-admins.component.html',
  styleUrls: ['./manage-admins.component.css']
})
export class ManageAdminsComponent implements OnInit {
  allAdmins = [];
  availableUsers = [];
  allUsers = [];
  newAdmin;
  adminToRemove: string;
  userToRemove: string;

  constructor(private mds: ManagementDataService) {
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

  addAdmin() {
    if (this.newAdmin && (this.availableUsers.includes(this.newAdmin))) {
      this.mds.registerAdmin(this.newAdmin).subscribe(data => {
        alert(data.body['message']);
      }, error => alert(error.error.message));
    } else {
      alert('user not available');
    }
  }

  removeAdmin() {
    this.mds.removeAdmin(this.adminToRemove).subscribe(data => {
      alert(data.body['message']);
    }, error => {
      alert(error.error.message);
    });
  }

  removeUser() {
    this.mds.removeUser(this.userToRemove).subscribe(data => {
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }
}
