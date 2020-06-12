import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-manage-sub-admins',
  templateUrl: './manage-sub-admins.component.html',
  styleUrls: ['./manage-sub-admins.component.css']
})
export class ManageSubAdminsComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = [];
  curSubAdmins = [];

  constructor(private mds: ManagementDataService, private route: ActivatedRoute, private titleService: Title) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' sub-admins');

    let self = this;
    mds.getAllPageSubAdmins(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        self.curSubAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    });
    mds.getAllAdmins().subscribe((data: any) => {
      if (data.body.content) {
        this.availableAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => {
      console.log(error.error.message);
    });
  }

  ngOnInit(): void {
  }

  updateSubAdmins() {
    this.mds.updatePageSubAdmins(this.curSubAdmins, this.pageName).subscribe(data => {
      //console.log(data);
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }

  addSubAdmin(admin: string) {
    this.curSubAdmins.push(admin);
  }

  removeSubAdmin(admin: string) {
    this.curSubAdmins = this.curSubAdmins.filter((elm) => elm !== admin);
  }
}
