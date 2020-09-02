import { Component, OnInit, ViewEncapsulation, Input, OnChanges, TemplateRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { TableConfig } from 'src/app/modals/general-table/table-config';
import { TableSize } from 'src/app/modals/general-table/table-size.enum';
import { GeneralTableService } from './general-table.service';
import { SortData } from 'src/app/modals/sorting/sort-data';
import { PaginationData } from 'src/app/modals/pagination/pagination-data';
import { SortUtil } from 'src/shared/utilities/sort-util';
import { SortOrder } from 'src/app/modals/sorting/sort-order.enum';
import { FilterData } from 'src/app/modals/filtering/filter-data';
import { TableActionButton } from 'src/app/modals/general-table/table-action-button';
import { DateUtil } from 'src/shared/utilities/date-util';
import { DisplayConstant } from 'src/shared/constants/display-constants/display-constant';

@Component({
  selector: 'app-general-table',
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GeneralTableComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() tableData: any[] = [];
  @Input() tableTitle: string = '';
  @Input() tableConfig: TableConfig;
  @Input() customPaginationData: PaginationData;
  @Input() customHeaderOptions: ColumnItem[] = [];
  @Input() customTemplate: TemplateRef<any>; // Template imported for non text column items
  @Input() totalRecords: number = 0;
  @Input() searchPlaceholder = 'Search';
  @Input() showSearchBox = false;
  @Input() showDateFilter = false;
  @Input() showRangeDateFilter = false;
  @Input() dateFilterPlaceholder = 'Select a date';
  @Input() tableActionButtons: TableActionButton[] = [];
  @Input() showColShowHide = false;
  @Input() selectedCols: ColumnItem[] = []; // cols selected in the col show hide dropdown
  @Input() indexToExpand: Map<number, boolean> = new Map();
  @Input() rowExpandableTemplate: TemplateRef<any>;
  @Input() maxShowHideColSelections = DisplayConstant.SHOW_HIDE_COL_MAX_SELECTION;

  @Output() selectedRows = new EventEmitter<{}>();
  @Output() paginatedData = new EventEmitter<{}>();
  @Output() sortObj = new EventEmitter<{}>();
  @Output() editRow = new EventEmitter<{}>();
  @Output() eEmitSelectedFilters = new EventEmitter<any>();
  @Output() emitSelectedRows = new EventEmitter<any>();
  @Output() eEmitSearchInput = new EventEmitter<string>();
  @Output() eEmitSelectedCols = new EventEmitter<any>();
  @Output() eEmitsortData = new EventEmitter<any>();
  @Output() eEmitSelectedDate = new EventEmitter<any>();
  @Output() eEmitRangeDateFilter = new EventEmitter<any>();


  scrollWidth: string = 'calc(100% - 210px)';
  paginationData: PaginationData = { size: 10, page: 1 };
  currentTemplate: TemplateRef<any>; // Template reference used in general table
  tableSize: string = TableSize.SMALL;
  listofDisplayData: any[];

  // Checkoboxes
  selectedRowIds: { [key: string]: boolean } = {};
  isAllRecordsChecked: boolean = false; // Checkbox on table header when all records are checked
  isIndeterminate: boolean = false; // Checkbox on table header when few records are checked

  // Sorting and Filtering
  sortData: SortData = {};
  selectedFilters: any[] = [];
  activeColumn: any;
  filterObj: FilterData;
  filters: FilterData[];
  selectedRowObjects: any[] = [];
  showHideCols: ColumnItem[] = [];
  colsToDisplay: ColumnItem[] = [];

  // date filter date
  selectedDate: Date;
  dateFormat: string;
  dateRange: []


  constructor(private generalTableService: GeneralTableService) { }

  ngOnInit() {
    this.currentTemplate = this.customTemplate;
    this.listofDisplayData = [...this.tableData];
    if (this.customPaginationData && this.customPaginationData.size) {
      this.paginationData.size = this.customPaginationData.size;
    }
    if (this.customPaginationData && this.customPaginationData.page) {
      this.paginationData.page = this.customPaginationData.page;
    }
    this.setColumns();
    this.getDefaultDateFormat();
  }

  ngAfterViewInit() {
    // this.setColumns();
  }

  setColumns() {
    // const nonHiddenCols = this.customHeaderOptions.filter(col => col.hidden !== true);
    this.showHideCols = this.customHeaderOptions.filter(col => (col.permanent === false || col.permanent === undefined) && col.hidden !== true);
    this.colsToDisplay = this.customHeaderOptions.filter(col => col.hidden !== true || col.permanent === true);
    // this.showHideCols = nonHiddenCols.filter(col => (col.permanent === false || col.permanent === undefined) && col.hidden !== true);
    // this.colsToDisplay = nonHiddenCols.filter(col => col.hidden !== true || col.permanent === true);
    this.selectedCols = this.showHideCols.filter(col => col.default === true);
    this.onSelectedColsChange();
  }

  getDefaultDateFormat() {
    this.dateFormat = DateUtil.inputDefaultDateFormat;
  }

  ngOnChanges() {
    this.listofDisplayData = [...this.tableData];
    if (this.customPaginationData && this.customPaginationData.size) {
      this.paginationData.size = this.customPaginationData.size;
    }
    if (this.customPaginationData && this.customPaginationData.page) {
      this.paginationData.page = this.customPaginationData.page;
    }
  }

  /**
   * @author Aman Purohit
   * @description Click event of general table filters.
   * @param {string[]} selectedFilters
   * @param {string} activeColumn
   * @memberof GeneralTableComponent
   */
  filter(selectedFilters: string[], activeColumn: string, filterObj?: FilterData): void {

    this.selectedFilters = selectedFilters;
    this.activeColumn = activeColumn;
    this.filterObj = filterObj;
    // Sets the page number to 1 after every filter --> not necessary, remove
    this.paginationData.page = 1;
    this.filterAndSort();
  }

  /**
   * @author Aman Purohit
   * @description Click event of general table sorting.
   *
   * @param {{key: string, value: string}} data
   * @memberof GeneralTableComponent
   */
  sort(data: { key: string, value: string }): void {
    this.sortData.sortColumn = data.key;
    // this.sortData.sortOrder = data.value;
    this.paginationData.page = 1;
    if (data.value === 'ascend') { this.sortData.sortOrder = SortOrder.ASCENDING; }
    else if (data.value === 'descend') { this.sortData.sortOrder = SortOrder.DESCENDING; }
    else { this.sortData.sortOrder = ''; }

    if (this.tableConfig.frontEnd) {
      this.filterAndSort();
    } else {
      this.sortObj.emit({ sortObj: this.sortData, paginationObj: this.paginationData });
      // New output emitter for sort data that will replace sortObj output emitter
      this.eEmitsortData.emit(this.sortData);
    }
  }

  /**
   * @author Aman Purohit
   * @description Perform filtering and sorting on listOfDisplayData
   * maintaining the state.
   *
   * @memberof GeneralTableComponent
   */
  filterAndSort(): void {

    if (this.tableConfig.frontEnd) {
      // Filter Data

      const filterFunc = (dataObject: {}, selectedFilters: any[]) =>
        (selectedFilters.length ? selectedFilters.some(name => (dataObject[this.activeColumn]).toString() === name) : true);

      const filteredData = this.tableData.filter(item => filterFunc(item, this.selectedFilters));

      // Sort Data

      if (this.sortData.sortColumn && this.sortData.sortOrder) {
        if (this.sortData.sortOrder === SortOrder.ASCENDING) {
          this.listofDisplayData = [...SortUtil.sortArrayWithCombinedField(filteredData, [this.sortData.sortColumn], null, SortOrder.ASCENDING)];
        } else {
          this.listofDisplayData = [...SortUtil.sortArrayWithCombinedField(filteredData, [this.sortData.sortColumn], null, SortOrder.DESCENDING)];
        }
      } else {
        this.listofDisplayData = [...filteredData];
      }
    } else {
      this.filterObj.value = this.selectedFilters;
      if (this.filters) {
        // do nothing
      } else {
        this.filters = [];
      }
      const index = this.filters.findIndex(filter => filter.field === this.activeColumn);
      if (index === -1) {
        if (this.filterObj.value === '' || (this.filterObj.value instanceof Array && !this.filterObj.value.length)) {
          // do nothing
        } else {
          this.filters.push(this.filterObj);
        }
      } else {
        if (this.filterObj.value === '' || (this.filterObj.value instanceof Array && !this.filterObj.value.length)) {
          this.filters.splice(index, 1);
        } else {
          // this.filters.push(this.filterObj);
          this.filters[index] = this.filterObj;
        }
      }
      this.eEmitSelectedFilters.emit(this.filters);
    }
  }

  /**
   * @author Aman Purohit
   * @description Emits the selected row id to parent component,
   * checks the condition for header checkbox (all checked or few checked)
   *
   * @memberof GeneralTableComponent
   */
  handleCheckboxClick(selectedRows: any): void {

    this.setSelectedRowObjects(selectedRows);

    this.emitSelectedRows.emit(this.selectedRowObjects);

    this.selectedRows.emit(this.generalTableService.returnSelectedRows(this.selectedRowIds));

    this.isAllRecordsChecked = this.listofDisplayData
      .every(item => this.selectedRowIds[item.id]);

    this.isIndeterminate =
      this.listofDisplayData.some(item => this.selectedRowIds[item.id]) &&
      !this.isAllRecordsChecked;
  }

  /**
   * @author Aman Purohit
   * @description Selects all the data & calls handleCheckboxClick()
   * to update the components.
   *
   * @param {boolean} isChecked
   * @memberof GeneralTableComponent
   */
  checkAll(isChecked: boolean): void {
    this.listofDisplayData.forEach(item => (this.selectedRowIds[item.id] = isChecked));
    this.handleCheckboxClick(this.listofDisplayData);
  }

  /**
   * @author Aman Purohit
   * @description Event handler for pagination page change
   * @param {number} pageNumber
   * @memberof GeneralTableComponent
   */
  pageIndexChanged(pageNumber: number): void {
    this.paginationData.page = pageNumber;
    this.paginatedData.emit(this.paginationData);
  }

  /**
   * @author Aman Purohit
   * @description Event handler for page size change, fetches
   * new data from API and page index is set to 1
   *
   * @param {number} pageSize
   * @memberof GeneralTableComponent
   */
  pageSizeChanged(pageSize: number): void {
    this.paginationData.page = 1;
    this.paginationData.size = pageSize;
    this.pageIndexChanged(this.paginationData.page);
  }

  /**
   * @description Emit row data for edit
   * @author Aman Purohit
   * @date 2020-06-08
   * @param {*} rowData
   * @memberof GeneralTableComponent
   */
  edit(rowData: any) {
    this.editRow.emit(rowData);
  }

  /**
   * @description Updates the selectedRow array
   * @author Aman Purohit
   * @date 2020-06-16
   * @param {*} selectedRow
   * @memberof GeneralTableComponent
   */
  setSelectedRowObjects(selectedRows: any) {
    let rows: any[] = [];
    if (!Array.isArray(selectedRows)) {
      rows.push(selectedRows);
    } else {
      rows = [...selectedRows];
    }
    rows.forEach((row: any) => {
      if (this.selectedRowIds[row.id]) {
        const isRowExists: boolean = this.selectedRowObjects.find(rowObj => rowObj.id === row.id);
        if (!isRowExists) {
          this.selectedRowObjects.push(row);
        }
      } else {
        this.selectedRowObjects = this.selectedRowObjects.filter(rowObj => rowObj.id !== row.id);
      }
    });
  }

  onSearchInput(value: string) {
    this.eEmitSearchInput.emit(value);
  }

  onSelectedColsChange() {
    this.selectedCols.forEach(col => col.hidden = false);
    this.showHideCols.forEach((col) => {
      if (this.selectedCols.findIndex(column => column.columnMap === col.columnMap) === -1) {
        col.hidden = true;
      } else {
        col.hidden = false;
      }
    });
    this.colsToDisplay = this.customHeaderOptions.filter((col) => {
      if (col.permanent === true) {
        return col;
      } else {
        this.showHideCols.forEach((column) => {
          if (col.columnMap === column.columnMap) {
            col.hidden = column.hidden;
          }
        });
        if (col.hidden === false) {
          return col;
        }
      }
    });
  }

  onDateFilterChange() {
    this.eEmitSelectedDate.emit(this.selectedDate);
  }

  onRangeDateFilterChange(result: Date){
    this.eEmitRangeDateFilter.emit(result)
  }

  getValueFromIndexMap(index: number) {
    if (this.indexToExpand && this.indexToExpand.has(index)) {
      return this.indexToExpand.get(index);
    } else {
      return false;
    }
  }

  onRowExpansionChange(event: boolean, index: number) {
    if (this.indexToExpand && this.indexToExpand.has(index)) {
      this.indexToExpand.set(index, event);
    } else {
      // do nothing, this case should never occur
    }
  }

}
