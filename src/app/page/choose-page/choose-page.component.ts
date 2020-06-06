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

  constructor(private pds: PageDataService) {
    pds.getRelatedPages().subscribe((data: any) => {
        this.pagesAndRoles = new Array<JSON>();
        //data.contents.forEach(content => console.log('type ' + typeof content));
        //console.log(data);
        if (data.body) {
          data.body.forEach(content => {
            this.pagesAndRoles.push({
              page: content.page
                .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
                .join(Utils.DOUBLE_QUOTES)
                .split(Utils.SINGLE_QUOTES_REPLACEMENT)
                .join(Utils.SINGLE_QUOTES)
                .split(Utils.NEW_LINE_REPLACEMENT)
                .join(Utils.NEW_LINE)
              , role: content.role
            });
          });
        }
      },
      error => {
        alert(error.error.message);
      });
  }

  ngOnInit(): void {
  }

}
