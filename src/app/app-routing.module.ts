import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './layout/login/login.component';
import { LoginCanActivateService } from './layout/login/services/guard-services/login-can-activate/login-can-activate.service';
import { RegisterComponent } from './layout/register/register.component';
import { RegisterCanActivateService } from './layout/register/services/guard-services/register-can-activate/register-can-activate.service';
import { MainComponent } from './layout/main/main.component';
import { MainCanActivateService } from './layout/main/services/guard-services/main-can-activate/main-can-activate.service';
import { UserProfileComponent } from './pages/profile/user-profile/user-profile.component';
import { ForgotPasswordComponent } from './layout/forgotPassword/forgotPassword.component';
import { NotFoundComponent } from './layout/notFound/notFoundComponent';
import { AppCustomPreloader } from './app-custom-preloader/app-custom-preloader';
import { DashboardCanActivateService } from './pages/dashboard/services/guard-services/dashboard-can-activate-service/dashboard-can-activate.service';
import { CallCanActivateService } from './pages/call/services/guard-services/call-can-activate-service/call-can-activate.service';
import { CompanyCanActivateService } from './pages/company/services/guard-services/company-can-activate-service/company-can-activate.service';
import { ScheduleCanActivateService } from './pages/schedule/services/guard-services/schedule-can-activate-service/schedule-can-activate.service';
import { DispatchCanActivateService } from './pages/dispatch/services/guard-services/dispatch-can-activate-service/dispatch-can-activate.service';
import { FollowUpCanActivateService } from './pages/follow-up/services/guard-services/follow-up-can-activate-service/follow-up-can-activate.service';
import { InvoiceCanActivateService } from './pages/invoice/services/guard-services/invoice-can-activate-service/invoice-can-activate.service';
import { ReportCanActivateService } from './pages/report/services/guard-services/report-can-activate-service/report-can-activate.service';
import { PriceBookCanActivateService } from './pages/price-book/services/guard-services/price-book-can-activate-service/price-book-can-activate.service';
import { NotificationCanActivateService } from './pages/notification/services/guard-services/notification-can-activate-service/notification-can-activate.service';
import { SettingsCanActivateService } from './pages/settings/services/guard-services/settings-can-activate-service/settings-can-activate.service';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { ResetPasswordComponent } from './layout/reset-password/reset-password.component';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { CustomerComponent } from './pages/customer/customer.component';
import { CustomerCanActivateGuard } from './pages/customer/services/guard-services/customer-can-activate/customer-can-activate.guard';
import { ProjectCanActivateGuard } from './pages/project/services/guard-services/project-can-activate/project-can-activate.guard';
import { JobCanActivateGuard } from './pages/job/services/guard-services/job-can-activate/job-can-activate.guard';
import { CanActivateForgotPasswordGuard } from './layout/forgotPassword/services/can-activate-forgot-password.guard';
import { CanActivateResetPasswordGuard } from './layout/reset-password/services/can-activate-reset-password.guard';
import { VendorCanActivateGuard } from './pages/vendor/services/gaurd/vendor-can-activate.gaurd';
import { PasswordChangeComponent } from './pages/password-change/password-change.component';
import { CanActivatePasswordChangeGuard } from './pages/password-change/services/guard-services/can-activate-password-change.guard';
import { DemoCanActivateGuard } from './pages/demo/services/guard-services/demo-can-activate.guard';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, canActivate: [LoginCanActivateService], data: { pageTitle: MenuConstants.LOGIN }
  },
  {
    path: 'register', component: RegisterComponent, canActivate: [RegisterCanActivateService], data: { pageTitle: MenuConstants.REGISTER }
  },
  {
    path: 'public/reset', component: ForgotPasswordComponent, canActivate: [CanActivateForgotPasswordGuard], data: { pageTitle: MenuConstants.FORGOT_PASSWORD }
  },
  {
    path: 'public/reset/confirm/:id', component: ResetPasswordComponent, canActivate: [CanActivateResetPasswordGuard], data: { pageTitle: MenuConstants.RESET_PASSWORD }
  },
  {
    path: '', component: MainComponent, canActivate: [MainCanActivateService],
    // path: '', component: FixedHeaderComponent, canActivate: [MainCanActivateService],
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: 'dashboard'
      },
      {
        path: 'profile', component: UserProfileComponent, data: { pageTitle: MenuConstants.USER_PROFILE }
      },
      {
        path: 'change-password', component: PasswordChangeComponent, canActivate: [CanActivatePasswordChangeGuard], data: { pageTitle: MenuConstants.CHANGE_PASSWORD, pageDescription: MenuConstants.CHANGE_PASSWORD_DESC }
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        data: { preload: true },
        canActivate: [DashboardCanActivateService]
      },
      {
        path: 'companies',
        loadChildren: () => import('./pages/company/company.module').then(m => m.CompanyModule),
        data: { preload: true },
        canActivate: [CompanyCanActivateService]
      },
      {
        path: AppUrlConstants.DEMOS,
        loadChildren: () => import('./pages/demo/demo.module').then(m => m.DemoModule),
        data: {preload: true},
        canActivate: [DemoCanActivateGuard]
      },
      // {
      //   path: 'calls',
      //   loadChildren: () => import('./pages/call/call.module').then(m => m.CallModule),
      //   data: { preload: true },
      //   canActivate: [CallCanActivateService]
      // },
      {
        path: 'schedule',
        loadChildren: () => import('./pages/schedule/schedule.module').then(m => m.ScheduleModule),
        data: { preload: true },
        canActivate: [ScheduleCanActivateService]
      },
      {
        path: 'dispatch',
        loadChildren: () => import('./pages/dispatch/dispatch.module').then(m => m.DispatchModule),
        data: { preload: true },
        canActivate: [DispatchCanActivateService]
      },
      {
        path: 'followUp',
        loadChildren: () => import('./pages/follow-up/follow-up.module').then(m => m.FollowUpModule),
        data: { preload: true },
        canActivate: [FollowUpCanActivateService]
      },
      {
        path: 'invoice',
        loadChildren: () => import('./pages/invoice/invoice.module').then(m => m.InvoiceModule),
        data: { preload: true },
        canActivate: [InvoiceCanActivateService]
      },
      {
        path: 'reports',
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportModule),
        data: { preload: true },
        canActivate: [ReportCanActivateService]
      },
      {
        path: 'priceBook',
        loadChildren: () => import('./pages/price-book/price-book.module').then(m => m.PriceBookModule),
        data: { preload: true },
        canActivate: [PriceBookCanActivateService]
      },
      {
        path: 'notification',
        loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationModule),
        data: { preload: true },
        canActivate: [NotificationCanActivateService]
      },
      {
        path: AppUrlConstants.CUSTOMERS,
        loadChildren: () => import('./pages/customer/customer.module').then(m => m.CustomerModule),
        data: { preload: true },
        canActivate: [CustomerCanActivateGuard]
      },
      {
        path: AppUrlConstants.PROJECTS,
        loadChildren: () => import('./pages/project/project.module').then(m => m.ProjectModule),
        data: { preload: true },
        canActivate: [ProjectCanActivateGuard]
      },
      {
        path: AppUrlConstants.JOBS,
        loadChildren: () => import('./pages/job/job.module').then(m => m.JobModule),
        data: { preload: true },
        canActivate: [JobCanActivateGuard]
      },
      {
        path: AppUrlConstants.VENDORS,
        loadChildren: () => import('./pages/vendor/vendor.module').then(m => m.VendorModule),
        data: { preload: true },
        canActivate: [VendorCanActivateGuard]
      },
      {
        path: AppUrlConstants.SETTINGS,
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
        data: { preload: true },
        canActivate: [SettingsCanActivateService]
      }
    ],
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false, preloadingStrategy: AppCustomPreloader })],
  exports: [RouterModule],
  providers: [AppCustomPreloader]
})
export class AppRoutingModule { }
