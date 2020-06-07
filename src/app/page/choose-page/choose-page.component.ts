import {Component, OnInit} from '@angular/core';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Utils} from '../../utilities/Utils';

@Component({
  selector: 'app-choose-page',
  templateUrl: './choose-page.component.html',
  styleUrls: ['./choose-page.component.css']
})
export class ChoosePageComponent implements OnInit {
  pagesAndRoles: any[];
  loading = true;

  constructor(private pds: PageDataService) {
    pds.getRelatedPages().subscribe((data: any) => {
        this.pagesAndRoles = new Array<JSON>();
        if (data.body) {
          data.body.forEach(content => {
            this.pagesAndRoles.push({
              page: this.handleText(content.page),
              role: content.role,
              about: (content.about.length > 210) ? this.handleText(content.about).substr(0, 210) + '...' : this.handleText(content.about)
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

  private handleText(text) {
    return text
      .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
      .join(Utils.DOUBLE_QUOTES)
      .split(Utils.SINGLE_QUOTES_REPLACEMENT)
      .join(Utils.SINGLE_QUOTES)
      .split(Utils.NEW_LINE_REPLACEMENT)
      .join(Utils.NEW_LINE);
  }
}
