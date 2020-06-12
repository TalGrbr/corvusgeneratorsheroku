import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle('Corvus Generators');
  }

  ngOnInit(): void {
  }

}
