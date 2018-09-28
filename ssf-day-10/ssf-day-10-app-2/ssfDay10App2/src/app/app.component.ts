import { Component, ViewChild } from '@angular/core';

import { SsfDay10App1Service } from './services/ssf-day10-app1.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';

export interface BookInfo {
  title: string;
  author: string;
  cover_thumbnail: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ssfDay10App2';

  displayedColumns: string[] = ['title', 'author', 'cover_thumbnail'];
  dataSource = new MatTableDataSource<BookInfo>([]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchCriteria = {
    'searchtitle': '',
    'searchauthor': '',
    'sorttitle': '',
    'sortauthor': '',
    'offset': 0,
    'limit': 20,
  };

  constructor(private bookSvc: SsfDay10App1Service) { }

  ngOnInit() {
    this.bookSvc.getAllBooks(this.searchCriteria).subscribe((results) => {
      console.log(results);
      this.dataSource = new MatTableDataSource<BookInfo>(results);
      this.dataSource.paginator = this.paginator;
    })
  }

  search() {
    console.log("subscribe backend...");
    this.bookSvc.getAllBooks(this.searchCriteria).subscribe((results) => {
      console.log(results);
      this.dataSource = new MatTableDataSource<BookInfo>(results);
      this.dataSource.paginator = this.paginator;
    })
  }
}