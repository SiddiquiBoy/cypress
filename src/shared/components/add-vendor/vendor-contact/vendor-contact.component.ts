import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { PlaceholderConstant } from 'src/shared/constants/placeholder-constants/placeholder-constant';
import { Utils } from 'src/shared/utilities/utils';
import { Vendor } from 'src/app/modals/vendor/vendor';
import { Tag } from 'src/app/modals/tag/tag';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { ChangeService } from 'src/shared/services/change/change.service';
import { AppMessages } from 'src/shared/constants/app-messages/app-messages';
import { Change } from 'src/app/modals/change/change';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'app-vendor-contact',
  templateUrl: './vendor-contact.component.html',
  styleUrls: ['./vendor-contact.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  encapsulation: ViewEncapsulation.None
})
export class VendorContactComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private changeService: ChangeService
  ) { }

  ngOnInit() {
    this.setPlaceholders();
    this.setRegExps();

  }

  _vendor: Vendor = new Vendor();
  @Input() set vendor(vendor) {
    this._vendor = vendor;
  }

  _tags: Tag[] = [];
  @Input() set tags(tags: Tag[]) {
    this._tags = tags;
    if (tags && tags.length > 0) {
      if (this.vendor && this.vendor.id) {
        this.setSelectedTags();
      }
    } else {
      this.messageService.info(AppMessages.CREATE_TAG);
    }
  }

  @Input() changedType: string;


  get vendor() {
    return this._vendor;
  }

  get tags() {
    return this._tags;
  }

  // placehoder
  vendorContactFirstNamePlaceholder: string;
  vendorContactLastNamePlaceholder: string;
  vendorContactEmailPlaceholder: string;
  vendorContactTagsPlaceholder: string;
  vendorContactPhonePlaceholder: string;
  vendorContactFaxPlaceholder: string;
  vendorContactMemoPlaceholder: string;


  // regex
  nameRegex: RegExp;
  phoneRegex: RegExp;
  emailRegex: RegExp;
  zipcodeRegex: RegExp;


  setPlaceholders() {
    this.vendorContactFirstNamePlaceholder = PlaceholderConstant.FIRST_NAME;
    this.vendorContactLastNamePlaceholder = PlaceholderConstant.LAST_NAME;
    this.vendorContactEmailPlaceholder = PlaceholderConstant.EMAIL;
    this.vendorContactTagsPlaceholder = PlaceholderConstant.TAGS;
    this.vendorContactPhonePlaceholder = PlaceholderConstant.PHONE_NUMBER;
    this.vendorContactFaxPlaceholder = PlaceholderConstant.FAX_NUMBER;
    this.vendorContactMemoPlaceholder = PlaceholderConstant.MEMO;

  }

  setRegExps() {
    this.nameRegex = Utils.nameRegex;
    this.phoneRegex = Utils.phoneRegex;
    this.emailRegex = Utils.emailRegex;
    this.zipcodeRegex = Utils.zipcodeRegex;
  }

  setSelectedTags() {
    if (this.tags && this.tags.length > 0 && this.vendor.tags && this.vendor.tags.length > 0) {
      const tags = this.tags.filter(tag => this.vendor.tags.findIndex(t => t.id === tag.id) !== -1);
      if (tags && tags.length > 0) {
        this.vendor.tags = tags;
      }
    } else {
      // do nothing
    }
  }

  setChangesObject(changes: Change[]): void {
    this.changeService.setChanges(changes);
    this.changeService.setMapFromChanges(this.changedType, changes);
  }

}
