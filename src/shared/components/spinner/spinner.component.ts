import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent implements OnInit {

  @Input() isSpinning = true;

  @Input() delay = 500;

  @Input() size = 'default';

  constructor() { }

  ngOnInit() {
  }

}
