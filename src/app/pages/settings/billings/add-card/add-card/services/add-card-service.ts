import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import gql from 'graphql-tag';

@Injectable({
    providedIn: 'root'
})
export class AddCardService {
    constructor(
        private apolloService: Apollo,
    ) { }

    addCard(token){
        return this.apolloService.mutate<any>({
            mutation: gql`
            mutation addCard($createPaymentCustomerDto: CreatePaymentCustomerDto!){
              addCard(createPaymentCustomerDto: $createPaymentCustomerDto) {
                id
              }
           }`,
            variables: {
              createPaymentCustomerDto: {
               paymentToken: token
              }
            }
          });
    }
}
