import {Component, OnInit} from '@angular/core';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Utils} from '../../utilities/Utils';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-choose-page',
  templateUrl: './choose-page.component.html',
  styleUrls: ['./choose-page.component.css']
})
export class ChoosePageComponent implements OnInit {
  pagesAndRoles: any[];
  loading = true;

  constructor(private pds: PageDataService,  private titleService: Title) {
    titleService.setTitle(Utils.PAGE_NAME);
    pds.getRelatedPages().subscribe((data: any) => {
        this.pagesAndRoles = new Array<JSON>();
        if (data.body) {
          data.body.forEach(content => {
            this.pagesAndRoles.push({
              page: content.page,
              role: content.role,
              about: (content.about.length > 210) ? content.about.substr(0, 210) + '...' : content.about
            });
          });
        }
        this.loading = false;
      },
      error => {
        alert(error.error.message);
      });
  }

  ngOnInit(): void {
  }
}
