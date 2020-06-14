import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-manage-page-admin',
  templateUrl: './manage-page-admin.component.html',
  styleUrls: ['./manage-page-admin.component.css']
})
export class ManagePageAdminComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = new Array<string>();
  curAdmin: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute, private titleService: Title, private toastService: ToastService) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' admin');

    mds.getPageAdmin(this.pageName).subscribe(data => {
      if (data.body['content']) {
        this.curAdmin = data.body['content'].toString().trim();
      }
    }, error => this.toastService.showDanger(error.error.message));

    mds.getAllAdmins().subscribe((data: any) => {
      if (data.body.content) {
        this.availableAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => {
      this.toastService.showDanger(error.error.message);
    });
  }

  ngOnInit(): void {
  }

  updateAdmin(admin: string) {
    if (admin && (this.availableAdmins.includes(admin))) {
      this.curAdmin = admin;
      this.mds.updatePageAdmin(this.curAdmin, this.pageName).subscribe(data => {
        this.toastService.showSuccess(`${admin}: ${data.body['message']}`);
      }, error => {
        this.toastService.showDanger(admin + ': ' + error.error.message);
      });
    } else {
      this.toastService.showDanger(admin + ': admin not available');
    }
  }
}
