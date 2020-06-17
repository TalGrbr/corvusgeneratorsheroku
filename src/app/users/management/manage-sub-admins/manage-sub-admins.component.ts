import {Component, OnInit} from '@angular/core';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-manage-sub-admins',
  templateUrl: './manage-sub-admins.component.html',
  styleUrls: ['./manage-sub-admins.component.css']
})
export class ManageSubAdminsComponent implements OnInit {
  readonly pageName: string;
  availableAdmins = [];
  curSubAdmins = [];
  filteredAdmins = [];

  constructor(private mds: ManagementDataService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastService: ToastService) {

    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' sub-admins');

    let self = this;
    mds.getAllPageSubAdmins(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        self.curSubAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => this.toastService.showDanger(error.error.message));
    mds.getAllAdmins().subscribe((data: any) => {
      if (data.body.content) {
        this.availableAdmins = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
        this.filteredAdmins = this.availableAdmins;
      }
    }, error => {
      this.toastService.showDanger(error.error.message);
    });
  }

  ngOnInit(): void {
  }

  updateSubAdmins() {
    this.mds.updatePageSubAdmins(this.curSubAdmins, this.pageName).subscribe(data => {
      this.toastService.showSuccess(data.body['message']);
    }, error => this.toastService.showDanger(error.error.message));
  }

  addSubAdmin(admin: string) {
    this.curSubAdmins.push(admin);
  }

  removeSubAdmin(admin: string) {
    this.curSubAdmins = this.curSubAdmins.filter((elm) => elm !== admin);
  }

  filterUsers(value: string) {
    if (!value) {
      this.filteredAdmins = this.availableAdmins;
    }
    this.filteredAdmins = Object.assign([], this.availableAdmins).filter(
      item => item.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
}
