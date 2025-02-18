import { Component } from '@angular/core';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { SearchService } from './services/search.service';
import { Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'test202502';
  searchText: string = '';
  pageSize = 10;
  pageIndex = 0;
  searchResults$:Observable<any>;

  constructor(private searchService: SearchService, private route: ActivatedRoute,) {
    this.searchResults$ = this.searchService.getResults();

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['searchText']){
        this.searchText = params['searchText'];
      }
      if (params['pageSize']){
        this.pageSize =  parseInt(params['pageSize']);
      }
      if (params['pageIndex']){
        this.pageIndex = parseInt(params['pageIndex']);
      }
      //this.search();
    });


  }

  onSearch() {
    if (this.searchText.trim()) {
      this.searchService.setSearchText(this.searchText);
    }
  }

  onPageChange(action: string) {
    if(action === 'previous'){
      this.pageIndex--;
    }else if(action === 'next'){
      this.pageIndex++;
    }
    this.searchService.setPageIndex(this.pageIndex);
  }

  onPageSizeChange(size: number) {
    this.searchService.setPageSize(size);
  }


}
