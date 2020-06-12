import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-manage-page-admin',
  templateUrl: './manage-page-admin.component.html',
  styleUrls: ['./manage-page-admin.component.css']
})
export class ManagePageAdminComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = new Array<string>();
  curAdmin: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute, private titleService: Title) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' admin');

    mds.getPageAdmin(this.pageName).subscribe(data => {
      if (data.body['content']) {
        this.curAdmin = data.body['content'].toString().trim();
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

  updateAdmin(admin: string) {
    if (admin && (this.availableAdmins.includes(admin))) {
      this.curAdmin = admin;
      this.mds.updatePageAdmin(this.curAdmin, this.pageName).subscribe(data => {
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
