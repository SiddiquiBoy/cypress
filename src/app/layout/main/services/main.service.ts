import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { MainQueries } from '../queries/main-queries';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private apolloService: Apollo,
  ) { }

  searchApp(orgId: string, search: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: MainQueries.SEARCH_APP,
      variables: {
        orgId,
        search
      },
      fetchPolicy: 'no-cache'
    });
  }
}
