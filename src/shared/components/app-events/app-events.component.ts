import { Component, OnInit, ViewEncapsulation, OnDestroy, Input } from '@angular/core';
import { EventSegment } from 'src/app/modals/enums/event-segment/event-segment.enum';
import { EventEntity } from 'src/app/modals/enums/event-entity/event-entity.enum';
import { EventService } from './services/event.service';
import { Subscription, Subject } from 'rxjs';
import { ErrorUtil } from 'src/shared/utilities/error-util';
import { MessageService } from 'src/shared/services/message-service/message.service';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Utils } from 'src/shared/utilities/utils';
import { AuditLog } from 'src/app/modals/audit-log/audit-log';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { GlobalFilterData } from 'src/app/modals/global-filtering/global-filter-data';
import { PaginationConstant } from 'src/shared/constants/pagination-constants/pagination-constant';
import { DateUtil } from 'src/shared/utilities/date-util';
import { Role } from 'src/app/modals/enums/role/role.enum';
import { ActionEvent } from 'src/app/modals/enums/action-event/action-event.enum';

@Component({
  selector: 'app-app-events',
  templateUrl: './app-events.component.html',
  styleUrls: ['./app-events.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppEventsComponent implements OnInit, OnDestroy {

  // tslint:disable-next-line: variable-name
  // _entity: EventEntity;
  // @Input() set entity(entity: EventEntity) {
  //   this._entity = entity;
  //   this.getEventLogs();
  // }

  // get entity() {
  //   return this._entity;
  // }

  // tslint:disable-next-line: variable-name
  _entityId: string;
  @Input() set entityId(entityId: string) {
    this._entityId = entityId;
    // this._entityId = '346e9556-8cea-4970-a98b-1a01b47f2a3d';
    this.getEventLogs();
  }

  get entityId() {
    return this._entityId;
  }

  // tslint:disable-next-line: variable-name
  _segment: EventSegment;
  @Input() set segment(segment: EventSegment) {
    this._segment = segment;
    this.setSearchPlaceholder();
    this.getEventLogs();
  }

  get segment() {
    return this._segment;
  }

  isSpinning = false;
  firstLoad = true;
  subscriptions: Subscription[] = [];
  isEventFetched$: Subject<boolean> = new Subject();
  auditLogs: AuditLog[] = [];
  columns: ColumnItem[] = [];
  tableConfig: TableConfig = new TableConfig();
  totalRecords: number;
  paginationData: PaginationData;
  sortData: SortData[] = [];
  filterData: FilterData[];
  globalFilterData: GlobalFilterData;
  searchPlaceholder: string;
  initialQueryVariablesSet = false;
  indexToExpand: Map<number, boolean> = new Map();
  defaultDateFormat: string;

  constructor(
    private eventService: EventService,
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.setColumns();
    this.setTableConfig();
    this.setInitialQueryVariables();
    this.defaultDateFormat = DateUtil.defaultDateFormat;
  }

  setColumns() {
    this.columns = this.eventService.getColumnItems();
  }

  setTableConfig() {
    this.tableConfig.showCheckboxes = false;
    this.tableConfig.showSerialNumbers = false;
    this.tableConfig.showPagination = true;
    this.tableConfig.showEditButton = false;
    this.tableConfig.frontEnd = false;
    this.tableConfig.expandableRows = true;
  }

  setInitialQueryVariables() {
    this.setInitialPaginationData();
    this.setInitialSortData();
    this.setInitialGlobalFilterData();
    this.setInitialFilterData();
    this.initialQueryVariablesSet = true;
    this.getEventLogs();
  }

  setInitialPaginationData() {
    this.paginationData = {
      page: 1,
      size: this.paginationData && this.paginationData.size ? this.paginationData.size : PaginationConstant.DEFAULT_PAGE_SIZE
    };
  }

  setInitialSortData() {
    this.sortData = [];
    const sortData: SortData = {
      sortColumn: 'createdAt',
      sortOrder: 'desc'
    };
    this.sortData.push(sortData);
  }

  setInitialGlobalFilterData() {
    this.globalFilterData = {
      q: ''
    };
  }

  setInitialFilterData() {
    this.filterData = [];
  }

  setPaginationData(data: PaginationData) {
    this.paginationData = data;
  }

  setSortData(data: SortData) {
    this.sortData = [];
    if (!data.sortOrder) {
      this.setInitialSortData();
    } else {
      if (data.sortColumn === 'fullName') {
        const firstNameSort: SortData = {
          sortColumn: 'firstName',
          sortOrder: data.sortOrder
        };
        const lastNameSort: SortData = {
          sortColumn: 'lastName',
          sortOrder: data.sortOrder
        };
        this.sortData.push(firstNameSort, lastNameSort);
      } else {
        this.sortData.push(data);
      }
    }
  }

  setGlobalFilterData(value: string) {
    this.globalFilterData = {
      q: value
    };
  }

  setFilterData(data: FilterData[]) {
    this.filterData = data;
  }

  setSearchPlaceholder() {
    switch (this.segment) {
      case EventSegment.emails: {
        this.searchPlaceholder = 'Search emails';
        break;
      }
      case EventSegment.notes: {
        this.searchPlaceholder = 'Search notes';
        break;
      }
      case EventSegment.events: {
        this.searchPlaceholder = 'Search events';
        break;
      }
      default: {
        this.searchPlaceholder = 'Search';
      }
    }
  }

  onPaginationChange(paginatedData: PaginationData): void {
    this.setPaginationData(paginatedData);
    this.getEventLogs();
  }

  onSortChange(data: any) {
    this.setSortData(data.sortObj);
    this.setInitialPaginationData();
    this.getEventLogs();
  }

  onSearchInput(value: string) {
    this.setGlobalFilterData(value);
    this.setInitialPaginationData();
    this.getEventLogs();
  }

  onFilter(event: FilterData[]) {
    this.setFilterData(event);
    this.setInitialPaginationData();
    this.getEventLogs();
  }

  getEventLogs() {
    // this.entity &&
    if (this.initialQueryVariablesSet && this.entityId && this.segment) {
      // switch (this.entity) {
      //   case EventEntity.job: {
      //     this.getJobSpecificLogs();
      //     break;
      //   }
      // }
      this.getLogs();
    } else {
      // do nothing
    }
  }

  getLogs() {
    this.isSpinning = true;
    this.subscriptions.push(
      this.eventService.getLogs(Utils.getEnumKey(EventSegment, this.segment), this.entityId, this.paginationData, this.sortData, this.globalFilterData, this.filterData).valueChanges.pipe(takeUntil(this.isEventFetched$)).subscribe(
        (response) => {
          if (response) {
            if (this.firstLoad) {
              this.firstLoad = false;
            }
            this.isSpinning = false;
            this.isEventFetched$.next(true);
            console.log('response is', response);
            this.auditLogs = response['data']['getLogs'];
            this.setInitialIndexToExpand();
            this.totalRecords = this.auditLogs.length;
            console.log('response is', this.auditLogs);
          } else {
            this.isSpinning = false;
          }
        },
        (error) => {
          const errorObj = ErrorUtil.getErrorObject(error);
          this.isSpinning = false;
          if (errorObj.message !== ErrorUtil.AUTH_TOKEN_EXPIRED) {
            this.messageService.error(errorObj.message);
          } else {
            // do nothing
          }
          if (errorObj.logout) {
            this.authenticationService.logout();
          }
        }
      )
    );
  }

  setInitialIndexToExpand() {
    this.indexToExpand = new Map();
    for (let i = 0; i < this.auditLogs.length; i++) {
      this.indexToExpand.set(i, false);
    }
  }

  getRole(roles: string[]): string[] {
    const updatedRoles = [];
    roles.forEach((role) => {

      switch (role) {
        case Role.ADMIN: {
          // return 'Admin';
          updatedRoles.push('Admin');
          break;
        }
        case Role.CUSTOMER: {
          // return 'Customer';
          updatedRoles.push('Customer');
          break;
        }
        case Role.ORGADMIN: {
          // return 'Org Admin';
          updatedRoles.push('Company Admin');
          break;
        }
        case Role.TECHNICIAN: {
          // return 'Technician';
          updatedRoles.push('Technician');
          break;
        }
        default: {
          // return role;
          updatedRoles.push(role);
        }
      }
    });
    return updatedRoles;
  }

  getAction(action: string) {
    switch (action) {
      case ActionEvent.UPDATE: {
        return 'Update';
      }
      case ActionEvent.ADD: {
        return 'Add';
      }
      case ActionEvent.DELETE: {
        return 'Delete';
      }
      case ActionEvent.CREATE: {
        return 'Create';
      }
      default: {
        return null;
      }
    }
  }

  ngOnDestroy() {
    // unsubscribing all the subscriptions
    this.subscriptions.forEach(s => s.unsubscribe());
    this.isEventFetched$.unsubscribe();
  }

}
