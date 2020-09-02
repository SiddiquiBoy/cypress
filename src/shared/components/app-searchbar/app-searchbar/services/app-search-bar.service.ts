import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppSearchResult } from 'src/app/modals/app-search-result/app-search-result';

@Injectable({
  providedIn: 'root'
})
export class AppSearchBarService {

  searchResult$: BehaviorSubject<AppSearchResult> = new BehaviorSubject(new AppSearchResult());

  constructor() { }

}
