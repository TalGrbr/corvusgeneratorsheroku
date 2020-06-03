import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../Auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagementDataService} from '../../server-handlers/management-data.service';

@Component({
  selector: 'app-manage-mods',
  templateUrl: './manage-mods.component.html',
  styleUrls: ['./manage-mods.component.css']
})
export class ManageModsComponent implements OnInit {
  readonly pageName: string;
  availableUsers = [];
  oldMods = [];
  newMods: string;

  constructor(private mds: ManagementDataService, private route: ActivatedRoute) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    let self = this;
    mds.getAllPageMods(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        self.oldMods = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    });
    mds.getAllAvailableUsers().subscribe((data: any) => {
      if (data.body.content) {
        this.availableUsers = data.body.content.toString().split(',').map((item) => {
          return item.trim();
        });
      }
    });
  }

  ngOnInit(): void {
  }

  updateMods() {
    this.mds.updatePageMods(this.newMods.split(','), this.pageName).subscribe(data => {
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }
}
