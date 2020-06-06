import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-manage-page-users',
  templateUrl: './manage-page-users.component.html',
  styleUrls: ['./manage-page-users.component.css']
})
export class ManagePageUsersComponent implements OnInit {
  readonly pageName: string;
  allUsers = [];
  curPageUsers = [];
  newPageUsers: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.paramMap.get('name');

    this.mds.getAllAvailableUsers().subscribe(data => {
      this.allUsers = data.body['content'].toString().split(',').map((item) => {
        return item.trim();
      });
    }, error => alert(error.error.message));

    this.mds.getAllPageUsers(this.pageName).subscribe(data => {
      this.curPageUsers = data.body['content'].toString().split(',').map((item) => {
        return item.trim();
      });
    }, error => alert(error.error.message));
  }

  ngOnInit(): void {
  }

  updatePageUsers() {
    this.mds.updatePageUsers(this.newPageUsers.split(','), this.pageName).subscribe(data => {
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }
}
