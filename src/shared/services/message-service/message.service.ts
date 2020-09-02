import { Injectable } from '@angular/core';
import { NzMessageService, NzMessageDataOptions } from 'ng-zorro-antd';
import { NotificationType } from 'src/app/modals/notification-type/notification-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  /**
   * @description the config object for nzMessage
   * @private
   * @type {NzMessageDataOptions}
   * @memberof MessageService
   */
  private config: NzMessageDataOptions;

  constructor(
    private nzMessageService: NzMessageService
  ) { }

  /**
   * @description to create the message
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @private
   * @param {string} type
   * @param {string} message
   * @memberof MessageService
   */
  private createMessage(type: string, message: string): void {
    this.config = this.setConfig(type);
    this.nzMessageService.create(type, message, this.config);
  }

  /**
   * @description to set the config object for the notification
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @private
   * @param {string} type
   * @returns {NzMessageDataOptions}
   * @memberof MessageService
   */
  private setConfig(type: string): NzMessageDataOptions {
    this.config = {};
    this.config.nzDuration = 2000;
    this.config.nzAnimate = true;
    this.config.nzPauseOnHover = true;
    return this.config;
  }

  /**
   * @description for success message
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @param {string} message
   * @memberof MessageService
   */
  success(message: string): void {
    this.createMessage(NotificationType.SUCCESS, message);
  }

  /**
   * @description for error message
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @param {string} message
   * @memberof MessageService
   */
  error(message: string): void {
    this.createMessage(NotificationType.ERROR, message);
  }

  /**
   * @description for warning message
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @param {string} message
   * @memberof MessageService
   */
  warn(message: string): void {
    this.createMessage(NotificationType.WARN, message);
  }

  /**
   * @description for info message
   * @author Pulkit Bansal
   * @date 2020-05-26
   * @param {string} message
   * @memberof MessageService
   */
  info(message: string): void {
    this.createMessage(NotificationType.INFO, message);
  }

}
