import { Component, OnInit } from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-manage-sub-admins',
  templateUrl: './manage-sub-admins.component.html',
  styleUrls: ['./manage-sub-admins.component.css']
})
export class ManageSubAdminsComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = [];
  oldSubAdmins = [];
  newSubAdmins: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    let self = this;
    mds.getAllPageSubAdmins(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        self.oldSubAdmins = data.body.content.toString().split(',').map((item) => {
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
    this.mds.updatePageSubAdmins(this.newSubAdmins.split(','), this.pageName).subscribe(data => {
      //console.log(data);
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }
}
