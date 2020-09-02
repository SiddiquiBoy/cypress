import { Injectable } from '@angular/core';
import { NzNotificationService, NzNotificationDataOptions } from 'ng-zorro-antd/notification';
import { NotificationType } from 'src/app/modals/notification-type/notification-type.enum';

/**
 * @description  notification service to be used in the app
 * @author Pulkit Bansal
 * @date 2020-04-30
 * @export
 * @class NotificationService
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  /**
   * @description this is the config object for notifications
   * @private
   * @type {NzNotificationDataOptions}
   * @memberof NotificationService
   */
  private config: NzNotificationDataOptions = {};

  constructor(
    private nzNotificationService: NzNotificationService,
  ) { }

  /**
   * @description to create the notification
   * this method displays the notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @private
   * @param {string} type
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  private createNotification(type: string, title: string, message: string): void {
    this.config = this.setConfig(type);
    this.nzNotificationService.create(type, title, message, this.config);
  }

  /**
   * @description to set the config object for the notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @private
   * @param {string} type
   * @returns {NzNotificationDataOptions}
   * @memberof NotificationService
   */
  private setConfig(type: string): NzNotificationDataOptions {
    this.config = {};
    this.config.nzDuration = 2000;
    this.config.nzAnimate = true;
    this.config.nzPauseOnHover = true;
    this.config.nzClass = this.getConfigClass(type);
    return this.config;
  }

  /**
   * @description to set and return the config class based on type
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @param {string} type
   * @returns {string}
   * @memberof NotificationService
   */
  getConfigClass(type: string): string {
    switch (type) {
      case NotificationType.SUCCESS: {
        return 'notification-background-success';
      }
      case NotificationType.ERROR: {
        return 'notification-background-error';
      }
      case NotificationType.INFO: {
        return 'notification-background-info';
      }
      case NotificationType.WARN: {
        return 'notification-background-warn';
      }
      default: {
        return '';
      }
    }
  }

  /**
   * @description for successful notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  success(title: string, message: string): void {
    this.createNotification(NotificationType.SUCCESS, title, message);
  }

  /**
   * @description for error notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  error(title: string, message: string): void {
    this.createNotification(NotificationType.ERROR, title, message);
  }

  /**
   * @description for warning notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  warn(title: string, message: string): void {
    this.createNotification(NotificationType.WARN, title, message);
  }

  /**
   * @description for informative notification
   * @author Pulkit Bansal
   * @date 2020-04-29
   * @param {string} title
   * @param {string} message
   * @memberof NotificationService
   */
  info(title: string, message: string): void {
    this.createNotification(NotificationType.INFO, title, message);
  }

}
