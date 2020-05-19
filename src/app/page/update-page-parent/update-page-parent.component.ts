import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-update-page-parent',
  templateUrl: './update-page-parent.component.html',
  styleUrls: ['./update-page-parent.component.css']
})
export class UpdatePageParentComponent implements OnInit {
  template = 'template';
  questionsForm = '{"questions": [ { "questionType": "dropBox", "questionName": "q1", "order": 0, "required": false, "questionLabels": { "forums": "asdasdas" } }, { "questionType": "textBox", "questionName": "q2", "order": 1, "required": false, "questionLabels": { "desc": "asdasd", "boxType": "number" } } ]}';
  pageData = '{"name": "name", "color": "color", "title": "title", "about": "<p>about</p>", "remarks": [ "<p>r1</p>", "<p>r2</p>" ]}';

  constructor() {
  }

  ngOnInit(): void {
  }

}
