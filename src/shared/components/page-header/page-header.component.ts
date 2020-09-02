import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { IconConstants } from 'src/shared/constants/icon-constants/icon-constants';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageHeaderComponent implements OnInit, OnDestroy {

  @Input() showBack = false;

  @Input() showTitle = true;

  @Input() showSubTitle = true;

  @Input() subTitle: string;

  @Input() showDescription = true;

  // @Input() description: string;

  subscriptions: Subscription[] = [];
  pageTitle: string;
  pageDescription: string;
  backIcon: string;

  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getPageTitle();
    this.backIcon = IconConstants.BACK;
  }

  /**
   * @description to get the page title from the route data property
   * @author Pulkit Bansal
   * @date 2020-05-18
   * @memberof PageHeaderComponent
   */
  getPageTitle() {
    this.subscriptions.push(
      this.route.data.subscribe(
        (data) => {
          if (data && data.pageTitle) {
            this.pageTitle = data.pageTitle;
          }
          if (data && data.pageDescription) {
            this.pageDescription = data.pageDescription;
          } else {
            // do nothing pageDescription
          }
        }
      )
    );
  }

  /**
   * @description the back functionality as provided by the browser
   * @author Pulkit Bansal
   * @date 2020-05-18
   * @memberof PageHeaderComponent
   */
  goBack() {
    if (window.history && window.history.length > 1) {
      window.history.back();
    } else {
      // do nothing
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
