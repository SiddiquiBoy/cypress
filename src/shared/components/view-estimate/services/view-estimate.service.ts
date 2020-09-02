import { Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ViewEstimateQueries } from '../queries/view-estimate-queries';
import { ColumnItem } from 'src/app/modals/general-table/column-item';
import { DataTypes } from 'src/app/modals/general-table/data-types.enum';
import { AuthenticationService } from 'src/shared/services/authentication-services/authentication.service';
import { FilterOp } from 'src/app/modals/filtering/filter-op.enum';
import { JobStatus } from 'src/app/modals/enums/job-status/job-status.enum';
import { Permission } from 'src/shared/constants/enums/permission-enum/permission.enum';
import { Utils } from 'src/shared/utilities/utils';

@Injectable({
  providedIn: 'root'
})
export class ViewEstimateService {

  constructor(
    private apolloService: Apollo,
    private authenticationService: AuthenticationService,
  ) { }

  getJobColumnItems(): ColumnItem[] {
    const columns: ColumnItem[] = [];
    columns.push(
      { name: 'Code', type: DataTypes.TEXT, columnMap: 'code', showSort: true, permanent: true, width: '120px' },
      { name: 'Job Type', type: DataTypes.CUSTOM, columnMap: 'jobType.name', showSort: true, permanent: true, width: '120px' },
      { name: 'Start Date', type: DataTypes.CUSTOM, columnMap: 'startDate', showSort: true, default: true, width: '120px' },
      { name: 'Start Time', type: DataTypes.CUSTOM, columnMap: 'startTime', showSort: true, default: true, width: '120px' },
      // { name: 'Tags', type: DataTypes.CUSTOM, columnMap: 'tags.name', showSort: true, default: true, width: '200px' },
      // { name: 'Summary', type: DataTypes.CUSTOM, columnMap: 'summary', showSort: true, default: false, width: '200px' },
      { name: 'Project', type: DataTypes.CUSTOM, columnMap: 'project.name', permanent: true, showSort: true, width: '120px' },
      { name: 'Customer', type: DataTypes.CUSTOM, columnMap: 'customer.fullName', permanent: true, showSort: true, width: '120px' },
      {
        name: 'Status', type: DataTypes.CUSTOM, columnMap: 'status', listOfFilters: Utils.createDropdownForNewEnum(JobStatus, false, false, false, true), showFilter: true,
        filter: { field: 'status', value: '', op: FilterOp.in }, permanent: true, width: '120px'
      },
      {
        name: 'Actions', type: DataTypes.CUSTOM, columnMap: 'action',
        permanent: this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL) ? true : false,
        hidden: this.authenticationService.checkPermission(Permission.VIEW_JOB_DETAIL) ? false : true,
        width: '75px'
      },
    );
    return columns;
  }

  getEstimate(id: string): QueryRef<any> {
    return this.apolloService.watchQuery({
      query: ViewEstimateQueries.QUERY_GET_ESTIMATE,
      fetchPolicy: 'no-cache',
      variables: {
        id
      }
    });
  }
}
