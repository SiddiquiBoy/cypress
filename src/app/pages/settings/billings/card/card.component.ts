import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CardService } from './services/card-service';
import { NzMessageService } from 'ng-zorro-antd';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardComponent implements OnInit {
  cards: any = []
  defaultCard: string;
  addButtonPermission:string;
  isSpinning = false
  constructor(
    private cardService: CardService,
    private nzMessageService: NzMessageService
  ) { }

  ngOnInit() {
    this.setAddButtonPermission();
    this.listCards();
  }

  listCards() {
    this.isSpinning = true;
    this.cardService.listCard().valueChanges.subscribe(response => {
      this.cards = response['data']['listCards']['data'];
      this.defaultCard = response['data']['listCards']['defaultSource'];
      this.isSpinning = false;
    }, error => {
      const errorObj = ErrorUtil.getErrorObject(error);
      this.isSpinning = false;
      this.nzMessageService.error(errorObj.message);
    });
  }


  remove(value: string):void{
    this.isSpinning = true;
    this.cardService.removeCard(value).subscribe(res => {
      this.nzMessageService.success(AppMessages.CARD_DELETED);
      this.isSpinning = false;
      this.listCards();
    }, error => {
      const errorObj = ErrorUtil.getErrorObject(error);
      this.isSpinning = false;
      this.nzMessageService.error(errorObj.message);
    })
  }

  confirm(value: string): void {
    this.cardService.makeCardDefault(value).subscribe(res => {
      this.nzMessageService.success(AppMessages.CARD_UPDATED);
      this.isSpinning = false;
      this.listCards();
    }, error => {
      const errorObj = ErrorUtil.getErrorObject(error);
      this.isSpinning = false;
      this.nzMessageService.error(errorObj.message);
    })
  }

  setAddButtonPermission(){
    this.addButtonPermission = Permission.ADD_CARD;
  }

}
