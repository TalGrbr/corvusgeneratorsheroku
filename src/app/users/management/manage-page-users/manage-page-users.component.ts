import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-manage-page-users',
  templateUrl: './manage-page-users.component.html',
  styleUrls: ['./manage-page-users.component.css']
})
export class ManagePageUsersComponent implements OnInit {
  readonly pageName: string;
  allUsers = [];
  curPageUsers = [];

  constructor(private mds: ManagementDataService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastService: ToastService) {

    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' users');

    this.mds.getAllAvailableUsers().subscribe(data => {
      this.allUsers = data.body['content'].toString().split(',').map((item) => {
        return item.trim();
      });
    }, error => this.toastService.showDanger(error.error.message));

    this.mds.getAllPageUsers(this.pageName).subscribe(data => {
      this.curPageUsers = data.body['content'].toString().split(',').map((item) => {
        return item.trim();
      });
    }, error => this.toastService.showDanger(error.error.message));
  }

  ngOnInit(): void {
  }

  addUser(user) {
    this.curPageUsers.push(user);
  }

  removeUser(user) {
    this.curPageUsers = this.curPageUsers.filter((elm) => elm !== user);
  }

  updatePageUsers() {
    this.mds.updatePageUsers(this.curPageUsers, this.pageName).subscribe(data => {
      this.toastService.showSuccess(data.body['message']);
    }, error => this.toastService.showDanger(error.error.message));
  }
}
