// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: '',
  graphqlUrl: 'https://dev.markarian.api-build-release.com/graphql',
  restUrl: 'https://dev.markarian.api-build-release.com/v1',
  // graphqlUrl: 'http://localhost:3000/graphql',
  // restUrl: 'http://localhost:3000/v1',
  appVersion: require('../../package.json').version,
  appReleaseDate: require('../../package.json').releaseDate,
  compassProWordpressHome: 'http://dev.markarian.wp.build-release.com/',
  compassProWordpressRegistration: 'http://dev.markarian.wp.build-release.com/contact/',
};


/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
