import {Component, OnInit} from '@angular/core';
import {PageDataService} from '../../server-handlers/page-data.service';
import {Utils} from '../../utilities/Utils';

@Component({
  selector: 'app-choose-page',
  templateUrl: './choose-page.component.html',
  styleUrls: ['./choose-page.component.css']
})
export class ChoosePageComponent implements OnInit {
  pages: any[];

  constructor(private pds: PageDataService) {
    pds.getAllPages().subscribe((data: any) => {
        this.pages = new Array<JSON>();
        //data.contents.forEach(content => console.log('type ' + typeof content));
        data.body.contents.forEach(content => {
          this.pages.push(JSON.parse(content
            .split(Utils.DOUBLE_QUOTES_REPLACEMENT)
            .join(Utils.DOUBLE_QUOTES)
            .split(Utils.SINGLE_QUOTES_REPLACEMENT)
            .join(Utils.SINGLE_QUOTES)
          ));
        });
      },
      error => {
        alert(error.error.errorBody);
      });
  }

  ngOnInit(): void {
  }

}
