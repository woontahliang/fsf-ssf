import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SsfDay10App1Service {
  constructor(private http: HttpClient) { }

  getAllBooks(criteria): Observable<any> {
    let finalSearchCriteria: string = `/books?searchtitle=${criteria.searchtitle}&searchauthor=${criteria.searchauthor}&sorttitle=${criteria.sorttitle}&sortauthor=${criteria.sortauthor}&limit=${criteria.limit}offset=${criteria.offset}`;
    console.log(finalSearchCriteria);
    return this.http
      .get(`${environment.api_url}${finalSearchCriteria}`)
      .pipe(
        catchError(this.handleError('getAllBooks', []))
      );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
