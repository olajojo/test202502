import { SearchResult } from './../interface/search-result.interface';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchText$ = new BehaviorSubject<string>('');
  private pageSize$ = new BehaviorSubject<number>(10);
  private pageIndex$ = new BehaviorSubject<number>(0);
  private searchResults$ = new BehaviorSubject<SearchResult | null>(null);
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    @Inject('DEFAULT_PAGE_SIZE') defaultPageSize: number
  ) {
    this.pageSize$.next(defaultPageSize || 10);
    this.restoreStateFromUrl();
  }
  setSearchText(text: string) {
    this.searchText$.next(text);
    this.pageIndex$.next(0);
    this.updateUrl();
    //this.search();
  }

  setPageSize(size: number) {
    this.pageSize$.next(size);
    this.pageIndex$.next(0);
    this.updateUrl();
    //this.search();
  }

  setPageIndex(index: number) {
    this.pageIndex$.next(index);
    this.updateUrl();
    //this.search();
  }

  getResults(): Observable<SearchResult | null> {
    return this.searchResults$.asObservable();
  }

  private search() {
    const query = this.searchText$.getValue();
    const page = this.pageIndex$.getValue();
    const pageSize = this.pageSize$.getValue();

    if (!query) return;

    this.http
      .get<SearchResult>(`https://openlibrary.org/search.json?q=${query}&page=${page + 1}&limit=${pageSize}`)
      .pipe(
        catchError(() => of(null))
      )
      .subscribe(results => {
        this.searchResults$.next(results)
      });
  }

  private updateUrl() {
    this.router.navigate([], {
      queryParams: {
        searchText: this.searchText$.getValue(),
        pageSize: this.pageSize$.getValue(),
        pageIndex: this.pageIndex$.getValue()
      },
      queryParamsHandling: 'merge'
    });
  }

  private restoreStateFromUrl() {
    this.route.queryParams.subscribe(params => {
      if (params['searchText']) this.searchText$.next(params['searchText']);
      if (params['pageSize']) this.pageSize$.next(+params['pageSize']);
      if (params['pageIndex']) this.pageIndex$.next(+params['pageIndex']);
      this.search();
    });
  }
}
