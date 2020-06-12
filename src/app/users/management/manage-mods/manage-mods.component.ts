import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from '../../Auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ManagementDataService} from '../../../server-handlers/management-data.service';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-manage-mods',
  templateUrl: './manage-mods.component.html',
  styleUrls: ['./manage-mods.component.css']
})
export class ManageModsComponent implements OnInit {
  readonly pageName: string;
  availableUsers = [];
  curMods = [];

  constructor(private mds: ManagementDataService, private route: ActivatedRoute, private titleService: Title) {
    this.pageName = this.route.snapshot.paramMap.get('name');
    titleService.setTitle('Manage ' + this.pageName + ' mods');
    mds.getAllPageMods(this.pageName).subscribe((data: any) => {
      if (data.body.content) {
        this.curMods = data.body.content.toString().split(',').map((item) => {
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
    this.mds.updatePageMods(this.curMods, this.pageName).subscribe(data => {
      alert(data.body['message']);
    }, error => alert(error.error.message));
  }

  addMod(mod: string) {
    this.curMods.push(mod);
  }

  removeMod(mod: string) {
    this.curMods = this.curMods.filter((elm) => elm !== mod);
  }
}
