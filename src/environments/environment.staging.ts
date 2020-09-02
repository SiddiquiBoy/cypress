export const environment = {
  production: false,
  baseUrl: '',
  graphqlUrl: 'https://staging.markarian.api-build-release.com/graphql',
  restUrl: 'https://staging.markarian.api-build-release.com/v1',
  appVersion: require('../../package.json').version,
  appReleaseDate: require('../../package.json').releaseDate,
  compassProWordpressHome: 'http://dev.markarian.wp.build-release.com/',
  compassProWordpressRegistration: 'http://dev.markarian.wp.build-release.com/contact/',
};
