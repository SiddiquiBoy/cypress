import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BillingsComponent } from './billings.component';
import { CardComponent } from './card/card.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { TransactionComponent } from './transaction/transaction.component';
import { MenuConstants } from 'src/shared/constants/menu-constants/menu-constants';
import { AddCardComponent } from './add-card/add-card/add-card.component';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { CanActivateAddCard } from './add-card/guard-services/can-activate-add-card.guard';
import { CanActivateCardGuard } from './card/services/guard-services/can-activate-card.guard';


const routes: Routes = [
  {
    path: '', component: BillingsComponent, children: [
      {
        path: '', redirectTo: 'card', pathMatch: 'full'
      },
      {
        path: 'card', component: CardComponent, canActivate: [CanActivateCardGuard],  data: { pageTitle: MenuConstants.CARD }
      },
      {
        path: 'card/add', component: AddCardComponent, canActivate: [CanActivateAddCard],data: { pageTitle: MenuConstants.ADD_CARD }
      },
      {
        path: 'invoice', component: InvoiceComponent, data: { pageTitle: MenuConstants.INVOICES }
      },
      {
        path: 'transaction', component: TransactionComponent, data: { pageTitle: MenuConstants.TRANSACTIONS }
      },
      {
        path: AppUrlConstants.PAYMENT,
        loadChildren: () => import('./payment/payment.module').then(m => m.PaymentModule),
        data: { preload: true },
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BillingsRoutingModule { }
