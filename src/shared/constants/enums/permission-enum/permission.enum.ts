/**
 * @description Enum of App Permissions
 * @export
 * @enum {number}
 */
export enum Permission {

  /*=============================================
  =            Menu Permissions            =
  =============================================*/

  MENU_DASHBOARD = 'menu:dashboard',
  MENU_COMPANIES = 'menu:companies',
  MENU_DEMOS = 'menu:demos',

  MENU_CALLS = 'menu:calls',

  /*=============================================
  =            Calls Submenu Permissions            =
  =============================================*/

  MENU_CALLS_CALLS = 'menu-calls:calls',
  MENU_CALLS_BOOKINGS = 'menu-calls:bookings',


  /*=====  End of Calls Submenu Permissions  ======*/

  MENU_SCHEDULE = 'menu:schedule',
  MENU_DISPATCH = 'menu:dispatch',
  MENU_INVOICE = 'menu:invoice',

  MENU_FOLLOW_UP = 'menu:follow-up',

  /*=============================================
  =            Reports Submenu Permissions           =
  =============================================*/

  MENU_FOLLOW_UP_ESTIMATES = 'menu-follow-up:estimates',

  /*=====  End of Reports Submenu Permissions ======*/

  MENU_NOTIFICATION = 'menu:notification',

  MENU_REPORTS = 'menu:reports',

  /*=============================================
  =            Reports Submenu Permissions           =
  =============================================*/

  MENU_REPORTS_HOME = 'menu-reports:home',
  MENU_REPORTS_ALL = 'menu-reports:all',
  MENU_REPORTS_SCHEDULED = 'menu-reports:scheduled',

  /*=====  End of Reports Submenu Permissions ======*/

  MENU_PRICEBOOK = 'menu:pricebook',

  /*=============================================
  =            Pricebook SideMenu Permissions           =
  =============================================*/

  MENU_PRICEBOOK_CATEGORIES = 'menu-pricebook:categories',
  MENU_PRICEBOOK_SERVICES = 'menu-pricebook:services',

  /*=====  End of Pricebook SideMenu Permissions ======*/


  MENU_SETTINGS = 'menu:settings',

  /*=============================================
  =            Settings SideMenu Permissions           =
  =============================================*/

  MENU_SETTINGS_BILLINGS = 'menu-settings:billings',

  /*=============================================
  =            Billings SubMenu Permissions           =
  =============================================*/

  MENU_BILLINGS_CARD = 'menu-billings:card',
  MENU_BILLINGS_INVOICES = 'menu-billings:invoices',
  MENU_BILLINGS_PAYMENT = 'menu-billings:payment',
  MENU_BILLINGS_TRANSACTIONS = 'menu-billings:transactions',

  /*=====  End of Billings SubMenu Permissions ======*/


  MENU_SETTINGS_COMPANY_PROFILE = 'menu-settings:company-profile',

  MENU_SETTINGS_PEOPLE = 'menu-settings:people',

  /*=============================================
  =            People SubMenu Permissions           =
  =============================================*/

  MENU_PEOPLE_EMPLOYEES = 'menu-people:employees',
  MENU_PEOPLE_TECHNICIANS = 'menu-people:technicians',

  /*=====  End of People SubMenu Permissions ======*/


  MENU_SETTINGS_OPERATIONS = 'menu-settings:operations',

  /*=============================================
  =            Operations SubMenu Permissions           =
  =============================================*/

  MENU_OPERATIONS_BUSINESS_UNITS = 'menu-operations:business-units',
  MENU_OPERATIONS_JOB_TYPES = 'menu-operations:job-types',
  MENU_OPERATIONS_TAGS = 'menu-operations:tags',
  MENU_OPERATIONS_TIMESHEET_CODES = 'menu-operations:timesheet-codes',

  /*=============================================
 =            Operations SubMenu Permissions           =
 =============================================*/

  MENU_BILLING_CARD = 'menu-billing:cards',
  MENU_BILLING_PAYMENT = 'menu-billing:payments',

  /*=====  End of Operations SubMenu Permissions ======*/


  MENU_SETTINGS_ROLES = 'menu-settings:roles',
  MENU_SETTINGS_TAGS = 'menu-settings:tags',
  MENU_SETTINGS_TIMESHEETS = 'menu-settings:timesheets',
  MENU_SETTINGS_CUSTOMERS = 'menu-settings:customers',
  MENU_SETTINGS_PROJECTS = 'menu-settings:projects',

  /*=====  End of Settings SideMenu Permissions ======*/


  MENU_CUSTOMERS = 'menu:customers',
  MENU_PROJECTS = 'menu:projects',
  MENU_JOBS = 'menu:jobs',
  MENU_VENDORS = 'menu:venders',


  /*=====  End of Menu Permissions  ======*/


  /*=============================================
  =            button + component permissions            =
  =============================================*/

  ADD_JOB_TYPE = 'add:job-type',
  EDIT_JOB_TYPE = 'edit:job-type',
  UPDATE_JOB_TYPE_STATUS = 'update:job-type-status',
  ADD_TAG = 'add:tag',
  EDIT_TAG = 'edit:tag',
  UPDATE_TAG_STATUS = 'update:tag-status',
  ADD_CUSTOMER = 'add:customer',
  EDIT_CUSTOMER = 'edit:customer',
  VIEW_CUSTOMER_DETAIL = 'view:customer-detail',
  UPDATE_CUSTOMER_STATUS = 'update:customer-status',
  VIEW_PROJECT_DETAIL = 'view:project-detail',
  ADD_PROJECT = 'add:project',
  EDIT_PROJECT = 'edit:project',
  EDIT_VENDOR = 'edit:vendor',
  ADD_VENDOR = 'add:vendor',
  UPDATE_VENDOR_STATUS = 'update:vendor-status',
  UPDATE_PROJECT_STATUS = 'update:project-status',
  ADD_JOB = 'add:job',
  EDIT_JOB = 'edit:job',
  VIEW_JOB_DETAIL = 'view:job-detail',
  VIEW_JOB_EVENTS = 'view:job-events',
  VIEW_JOB_EVENTS_NOTES = 'view:job-events-notes',
  VIEW_JOB_EVENTS_EMAILS = 'view:job-events-emails',
  VIEW_JOB_EVENTS_EVENTS = 'view:job-events-events',
  UPDATE_JOB_STATUS = 'update:job-status',
  UPDATE_JOB_TECHNICIAN = 'update:job-technician',
  ADD_EMPLOYEE = 'add:employee',
  EDIT_EMPLOYEE = 'edit:employee',
  UPDATE_EMPLOYEE_STATUS = 'update:employee-status',
  ADD_TECHNICIAN = 'add:technician',
  EDIT_TECHNICIAN = 'edit:technician',
  UPDATE_TECHNICIAN_STATUS = 'update:technician-status',
  ADD_TIMESHEET_CODE = 'add:timesheet-code',
  EDIT_TIMESHEET_CODE = 'edit:timesheet-code',
  UPDATE_TIMESHEET_CODE_STATUS = 'update:timesheet-code-status',
  ADD_PRICEBOOK_SERVICES = 'add:pricebook-services',
  EDIT_PRICEBOOK_SERVICES = 'edit:pricebook-services',
  UPDATE_PRICEBOOK_SERVICES_STATUS = 'update:pricebook-services-status',

  VIEW_PAYMENT = 'view:payment',

  ADD_CARD = 'add:card',
  REMOVE_CARD = 'remove:card',
  CHANGE_DEFAULT_CARD = 'change:default-card',



  ADD_BUSINESS_UNITS = 'add:business-unit',
  EDIT_BUSINESS_UNITS = 'edit:business-unit',
  UPDATE_BUSINESS_UNIT_STATUS = 'update:business-unit-status',

  ADD_CATEGORY = 'add:category',
  EDIT_CATEGORY = 'edit:category',
  UPDATE_CATEGORY_STATUS = 'update:category-status',

  ADD_JOB_NOTE = 'add:job-note',
  EDIT_JOB_NOTE = 'edit:job-note',
  VIEW_JOB_NOTE = 'view:job-note',

  CHANGE_PASSWORD = 'change:password',

  ADD_COMPANY = 'add:company',
  EDIT_COMPANY = 'edit:company',
  VIEW_COMPANY_DETAIL = 'view:company-detail',

  VIEW_APP_SEARCHBAR = 'view:app-searchbar',

  ADD_ESTIMATE = 'add:estimate',
  EDIT_ESTIMATE = 'edit:estimate',
  VIEW_ESTIMATE = 'view:estimate',
  UPDATE_ESTIMATE_STATUS = 'update:estimate-status',

  /*=====  End of button + component permissions  ======*/


  /*=============================================
  =            dropdown/action permissions            =
  =============================================*/

  UPDATE_JOB_STATUS_UNASSIGN = 'update:job-status-unassign',
  UPDATE_JOB_STATUS_SCHEDULE = 'update:job-status-schedule',
  UPDATE_JOB_STATUS_ON_HOLD = 'update:job-status-on-hold',
  UPDATE_JOB_STATUS_CANCEL = 'update:job-status-cancel',
  UPDATE_JOB_STATUS_DISPATCH = 'update:job-status-dispatch',
  UPDATE_JOB_STATUS_IN_PROGRESS = 'update:job-status-in-progress',
  UPDATE_JOB_STATUS_COMPLETE = 'update:job-status-complete',

  /*=====  End of dropdown/action permissions  ======*/
}

