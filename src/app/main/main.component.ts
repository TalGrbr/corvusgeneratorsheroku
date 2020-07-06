import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {Location} from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private titleService: Title, private location: Location) {
    titleService.setTitle('Corvus Generators');
    console.log(location.prepareExternalUrl(location.path()));
  }

  ngOnInit(): void {
  }

}
