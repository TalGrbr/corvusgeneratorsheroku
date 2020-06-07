import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-manage-page-admin',
  templateUrl: './manage-page-admin.component.html',
  styleUrls: ['./manage-page-admin.component.css']
})
export class ManagePageAdminComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = new Array<string>();
  oldAdmin: string;
  newAdmin: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.paramMap.get('name');

    mds.getPageAdmin(this.pageName).subscribe(data => {
      if (data.body['content']) {
        this.oldAdmin = data.body['content'];
      }
    }, error => alert(error.error.message));

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

  updateAdmin() {
    if (this.newAdmin && (this.availableAdmins.includes(this.newAdmin))) {
      this.mds.updatePageAdmin(this.newAdmin, this.pageName).subscribe(data => {
        alert(data.body['message']);
      }, error => {
        console.log(error);
        alert(error.error.message);
      });
    } else {
      alert('admin not available');
    }
  }
}
