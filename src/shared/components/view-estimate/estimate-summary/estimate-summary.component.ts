import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Estimate } from 'src/app/modals/estimate/estimate';
import { DateUtil } from 'src/shared/utilities/date-util';

@Component({
  selector: 'app-estimate-summary',
  templateUrl: './estimate-summary.component.html',
  styleUrls: ['./estimate-summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class EstimateSummaryComponent implements OnInit {

  @Input() estimate: Estimate;

  constructor() { }

  ngOnInit() {
  }

  getFormattedTimeFromDateString(date: Date) {
    return DateUtil.getFormattedTimeFromDate(date, false, false, true);
  }

}
