import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Technician } from 'src/app/modals/people/technician';
import { Observable } from 'rxjs';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { Utils } from 'src/shared/utilities/utils';
import { ActiveInactiveStatus } from 'src/app/modals/enums/active-inactive-status/active-inactive-status.enum';
import { GeneralStatus } from 'src/app/modals/enums/general-status/general-status.enum';

@Injectable({
  providedIn: 'root'
})
export class TechnicianService {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) { }

  getTechnicians(): Observable<Technician[]> {
    return this.http.get<Technician[]>('assets/jsons/employees.json');
  }

  getColumnItems(): ColumnItem[] {

    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Name', type: DataTypes.CUSTOM, columnMap: 'fullName', width: '250px', showSort: true, permanent: true, },
      { name: 'Office Phone', type: DataTypes.PHONE, columnMap: 'officePhone', width: '200px', permanent: true, },
      { name: 'Email', type: DataTypes.TEXT, columnMap: 'email', width: '200px', permanent: true, },
      {
        name: 'Business Unit', type: DataTypes.NESTED, columnMap: 'businessUnit', columnMap2: 'name', width: '200px'
        , showSort: false, permanent: true,
      },
      { name: 'Role', type: DataTypes.RANDOM, columnMap: 'roles', width: '200px', permanent: true, },
      {
        name: 'Status', type: DataTypes.ACTIVEINACTIVE, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(GeneralStatus, false, false, true, true),
        showFilter: true, width: '50px', filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true,
      },
      {
        name: 'Action', type: DataTypes.CUSTOM, columnMap: 'edit',
        permanent: this.authenticationService.checkPermission(Permission.EDIT_EMPLOYEE) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.EDIT_EMPLOYEE) ? false : true,
        width: '50px'
      }
    );

    return columns;
  }
}
