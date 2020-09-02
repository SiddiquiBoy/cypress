import { GraphQLError } from 'graphql';

export class ErrorUtil {

  public static AUTH_TOKEN_EXPIRED = 'Auth token expired';

  private static refreshTokenExpired = false;

  static isRefreshTokenExpired() {
    return this.refreshTokenExpired;
  }

  static resetRefreshToken() {
    this.refreshTokenExpired = false;
  }

  static getErrorObject(error: any): { title: string, message: string, logout: boolean } {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      const errors: GraphQLError[] = error.graphQLErrors;
      let errorTitle: string;
      let authorizationTitle: string;
      let errorMessage: string;
      let logout = false;
      errors.forEach((err) => {
        if (!logout) {
          if (err.message === 'Unauthorized') {
            logout = true;
            authorizationTitle = 'Token expired';
            errorMessage = ErrorUtil.AUTH_TOKEN_EXPIRED;
          }
          if (err.message === 'Token expired.') {
            logout = true;
            authorizationTitle = 'Refresh token expired';
            this.refreshTokenExpired = true;
          }
        }
        errorTitle = authorizationTitle || err.extensions.code;
        errorMessage = errorMessage || err.message;
      });
      return { title: errorTitle, message: errorMessage, logout };
    }
    if (error.networkError) {
      const err = error.networkError;
      let title: string;
      let message: string;
      if (err.error && err.error.errors && err.error.errors.length > 0) {
        err.error.errors.forEach((e) => {
          title = (e.extenstions && e.extensions.code) ? e.extensions.code : 'Unknown Error';
          message = e.message;
        });
      } else {
        title = err.statusText;
        message = err.message;
      }
      return { title, message, logout: false };
    }
    return { title: 'Unknown Error', message: 'Please Refresh', logout: false };
  }
}
