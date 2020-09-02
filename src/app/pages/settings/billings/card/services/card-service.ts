import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class CardService {
    constructor(
        private apolloService: Apollo,
        private authenticationService: AuthenticationService
    ) { }

    listCard(){
        return this.apolloService.watchQuery({
            query: gql`
            query listCards {
              listCards {
                data {
                  id
                  exp_month
                  exp_year
                  last4
                }
                defaultSource
              }
            }
            `,
            variables: {},
            fetchPolicy: 'network-only'
          });
    }


    removeCard(cardToken){
      return this.apolloService.mutate<any>({
          mutation: gql`
          mutation removeCard($cardToken: String!){
            removeCard(cardToken: $cardToken) {
              id
            }
         }`,
         fetchPolicy: 'no-cache',
         variables: {
           cardToken
         }
        });
  }

  makeCardDefault(cardToken){
      return this.apolloService.mutate<any>({
          mutation: gql`
          mutation changeDefaultCard($cardToken: String!){
            changeDefaultCard(cardToken: $cardToken) {
              id
            }
         }`,
         fetchPolicy: 'no-cache',
         variables: {
          cardToken
         }
        });
  }
}
