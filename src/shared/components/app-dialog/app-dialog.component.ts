import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-app-dialog',
  templateUrl: './app-dialog.component.html',
  styleUrls: ['./app-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppDialogComponent implements OnInit, OnDestroy {


  @Input() isVisible = false;
  @Input() footerHide: boolean = false;
  @Input() title: string;
  @Input() componentSelector: string;
  @Input() hideDialogOnAction = true;
  @Input() okText: string = 'Ok';
  @Input() cancelText: string = 'Cancel';
  @Input() withFooter: boolean = true;

  @Output() eEmitOnOkClick: EventEmitter<any> = new EventEmitter();
  @Output() eEmitOnCancelClick: EventEmitter<any> = new EventEmitter();

  subscriptions: Subscription[] = [];

  constructor(
    private modalService: NzModalService,
  ) { }

  ngOnInit() { }

  handleOk(): void {
    if (this.hideDialogOnAction) {
      this.isVisible = false;
    }
    this.eEmitOnOkClick.emit(false);
  }

  handleCancel(): void {
    if (this.hideDialogOnAction) {
      this.isVisible = false;
    }
    this.eEmitOnCancelClick.emit(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
