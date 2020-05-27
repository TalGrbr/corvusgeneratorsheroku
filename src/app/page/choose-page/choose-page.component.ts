import {Component, OnInit} from '@angular/core';
import {PageDataService} from '../../server-handlers/page-data.service';

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
      data.contents.forEach(content => this.pages.push(JSON.parse(content)));
    });
  }

  ngOnInit(): void {
  }

}
