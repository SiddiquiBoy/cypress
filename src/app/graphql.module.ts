// import { NgModule } from '@angular/core';
// import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
// import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
// import { InMemoryCache } from 'apollo-cache-inmemory';
// import { setContext } from 'apollo-link-context';
// import { ApolloLink } from 'apollo-link';
// import { Utils } from 'src/shared/utilities/utils';

// // const uri = 'https://o5x5jzoo7z.sse.codesandbox.io/graphql'; // <-- add the URL of the GraphQL server here
// const uri = 'https://dev.markarian.api-build-release.com/graphql';
// export function createApollo(httpLink: HttpLink) {

//   const token = Utils.getItemFromLocalStorage('accessToken');
//   const bearer = 'Bearer ' + token;
//   const auth = setContext((operation, context) => ({
//     headers: {
//       Authorization: bearer
//     },
//   }));

//   const link = ApolloLink.from([httpLink.create({ uri })]);
//   const cache = new InMemoryCache();

//   return {
//     link,
//     cache
//   };
// }

// @NgModule({
//   exports: [
//     ApolloModule,
//     HttpLinkModule
//   ],
//   providers: [
//     {
//       provide: APOLLO_OPTIONS,
//       useFactory: createApollo,
//       deps: [HttpLink],
//     },
//   ],
// })
// export class GraphQLModule { }




import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ApolloModule, Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { Utils } from 'src/shared/utilities/utils';
import { onError } from 'apollo-link-error';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { environment } from 'src/environments/environment';


const uri = environment.graphqlUrl;

export function provideApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  // Get the authentication token from local storage if it exists
  // const token = Utils.getItemFromLocalStorage('accessToken');
  // const auth = setContext((operation, context) => ({
  //   headers: {
  //     Authorization: `Bearer ${token}`
  //   },
  // }));

  const auth = setContext(async (_, { headers }) => {
    // Grab token if there is one in storage or hasn't expired
    let token = Utils.getItemFromLocalStorage('accessToken');
    if (!token) {
      token = Utils.getItemFromSessionStorage('accessToken');
    }
    // const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InB1bGtpdEBjcm93bnN0YWNrLmNvbSIsImlhdCI6MTU5MTI2OTczMiwiZXhwIjoxNTkxMzU2MTMyfQ.c9wriuCNwDZXYenixL7ZyCaaReK0dz0TwRoSwpTDQyY';
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  });

  const error = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors && graphQLErrors.length > 0) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
    // const errorObj = ErrorUtil.getErrorObject({ graphQLErrors, networkError });
    // // this.notificationService.error(errorObj.title, errorObj.message);
    // this.messageService.error(errorObj.message);
    // if (errorObj.logout) {
    //   this.logout();
    // }
  });

  // error
  const link = ApolloLink.from([basic, auth, error, httpLink.create({ uri })]);
  const cache = new InMemoryCache();
  const defaultOptions = {
    watchQuery: {
      errorPolicy: 'all'
    }
  };

  return {
    link,
    cache,
    // defaultOptions
  };
}

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule { }
