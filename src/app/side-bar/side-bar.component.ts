import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent implements OnInit {

  @ViewChild('searchInput')
  searchInput: ElementRef | undefined;


  constructor() { }

  ngOnInit(): void {
  }

  search() {
    const searchPhrase = this.searchInput?.nativeElement.value;

  }

}
