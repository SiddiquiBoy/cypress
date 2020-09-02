import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgZorroAntdModule, NZ_I18N, en_US, NzBadgeModule } from 'ng-zorro-antd';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';

import { UserProfileComponent } from './pages/profile/user-profile/user-profile.component';
import { environment } from 'src/environments/environment';
import { BASE_URL } from 'src/shared/services/base-service/base.service';
import { ApiInterceptorService } from 'src/shared/services/api-interceptor-service/api-interceptor.service';
import { IconsProviderModule } from './icons-provider.module';
import { LoginComponent } from './layout/login/login.component';
import { MainComponent } from './layout/main/main.component';
import { RegisterComponent } from './layout/register/register.component';
import { ForgotPasswordComponent } from './layout/forgotPassword/forgotPassword.component';
import { NotFoundComponent } from './layout/notFound/notFoundComponent';
import { HeaderAndSidebarComponent } from './layout/header-and-sidebar/header-and-sidebar.component';
import { FixedHeaderComponent } from './layout/fixed-header/fixed-header.component';
import { GraphQLModule } from './graphql.module';
import { AppDialogModule } from 'src/shared/components/app-dialog/app-dialog.module';
import { AppSearchbarModule } from 'src/shared/components/app-searchbar/app-searchbar/app-searchbar.module';
import { ResetPasswordComponent } from './layout/reset-password/reset-password.component';
import { SharedDirectiveModule } from 'src/shared/directives/shared-directive.module';
import { PageHeaderModule } from 'src/shared/components/page-header/page-header.module';
import { FileUploadModule } from 'src/shared/components/file-upload/file-upload.module';
import { ChangePasswordModule } from 'src/shared/components/change-password/change-password.module';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';
// import localeIn from '@angular/common/locales/en-IN';

registerLocaleData(en);
// registerLocaleData(localeIn, 'en-IN');

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    NotFoundComponent,
    HeaderAndSidebarComponent,
    FixedHeaderComponent,
    PasswordChangeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    GraphQLModule,
    AppDialogModule,
    NzBadgeModule,
    AppSearchbarModule,
    SharedDirectiveModule,
    PageHeaderModule,
    FileUploadModule,
    ChangePasswordModule
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    { provide: BASE_URL, useValue: environment.baseUrl },
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
