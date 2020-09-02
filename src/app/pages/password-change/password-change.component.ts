import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PasswordChangeComponent implements OnInit, OnDestroy {

  isSpinning = false;
  subscriptions: Subscription[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
