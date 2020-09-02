import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { AddCardService } from './services/add-card-service';
import { Router } from '@angular/router';
import { AppUrlConstants } from 'src/shared/constants/app-url-constants/app-url-constants';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { ErrorUtil } from 'src/shared/utilities/error-util';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss'],
  // encapsulation: ViewEncapsulation.None
})

export class AddCardComponent implements OnInit {

  @ViewChild(StripeCardComponent, { static: false }) card: StripeCardComponent;
  isSpinning = false;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#ffffff',
        color: '#eeeeee',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
  valid:boolean = false;

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  validForm(){

  }

  stripeTest: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stripeService: StripeService,
    private addCardService: AddCardService,
    private router: Router,
    private messageService: MessageService

  ) {}

  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  createToken(): void {
    const name = this.stripeTest.get('name').value;
    let self = this;
    this.isSpinning = true;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        if (result.token) {
          // Use the token
          self.addCardService.addCard(result.token.id)
          .subscribe(response => {
            this.messageService.success(AppMessages.CARD_ADDED);
            this.isSpinning = false;
            this.navigateToCardList();
          }, error => {
            const errorObj = ErrorUtil.getErrorObject(error);
            this.isSpinning = false;
            this.messageService.error(errorObj.message);
          })
        } else if (result.error) {
          // Error creating the token
          const errorObj = ErrorUtil.getErrorObject(result.error);
          this.isSpinning = false;
          this.messageService.error(errorObj.message);
        }
      });
  }


  navigateToCardList() {
    this.router.navigate(
      [AppUrlConstants.SLASH + AppUrlConstants.SETTINGS + AppUrlConstants.SLASH + AppUrlConstants.BILLINGS + AppUrlConstants.SLASH + AppUrlConstants.CARD]
    );
  }
}
