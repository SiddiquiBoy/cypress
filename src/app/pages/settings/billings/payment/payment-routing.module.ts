import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { CanActivateViewProjectGuard } from 'src/shared/components/view-project/services/can-activate-project.guard';
import { PaymentComponent } from './payment.component';
import { ViewPaymentComponent } from 'src/shared/components/view-payment/view-payment.component';
import { CanActivatePaymentGuard } from './guard-services/can-activate-payment.guard';
import { CanActivateViewPaymentGuard } from './guard-services/can-activate-view-payment.guard';


const routes: Routes = [
  {
    path: '', component: PaymentComponent, canActivate: [CanActivatePaymentGuard], data: { pageTitle: MenuConstants.PAYMENTS }
  },
  {
    path: ':viewid' + AppUrlConstants.SLASH + AppUrlConstants.VIEW, component: ViewPaymentComponent, canActivate: [CanActivateViewPaymentGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
