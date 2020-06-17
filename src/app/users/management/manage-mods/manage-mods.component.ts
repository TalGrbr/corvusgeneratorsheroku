import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../Auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {Title} from '@angular/platform-browser';
import {ToastService} from '../../../logging/toast.service';

@Component({
  selector: 'app-manage-mods',
  templateUrl: './manage-mods.component.html',
  styleUrls: ['./manage-mods.component.css']
})
export class ManageModsComponent implements OnInit {
  readonly pageName: string;
  availableUsers = [];
  curMods = [];
  filteredUsers = [];

  constructor(private mds: ManagementDataService,
              private route: ActivatedRoute,
              private titleService: Title,
              private toastService: ToastService) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' mods');
    mds.getAllPageMods(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        this.curMods = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    }, error => this.toastService.showDanger(error.error.message));
    mds.getAllAvailableUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.availableUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
        this.filteredUsers = this.availableUsers;
      }
    }, error => this.toastService.showDanger(error.error.message));
  }

  ngOnInit(): void {
  }

  updateMods() {
    this.mds.updatePageMods(this.curMods, this.pageName).subscribe(data => {
      this.toastService.showSuccess(data.body['message']);
    }, error => this.toastService.showDanger(error.error.message));
  }

  addMod(mod: string) {
    this.curMods.push(mod);
  }

  removeMod(mod: string) {
    this.curMods = this.curMods.filter((elm) => elm !== mod);
  }

  filterUsers(value: string) {
    if (!value) {
      this.filteredUsers = this.availableUsers;
    }
    this.filteredUsers = Object.assign([], this.availableUsers).filter(
      item => item.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
  }
}
