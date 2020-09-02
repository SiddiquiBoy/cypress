import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SettingsApiService } from '../services/settings-api.service';
import { Employee } from 'src/app/modals/people/employee';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PeopleComponent implements OnInit {

  constructor(
    // tslint:disable-next-line: variable-name
    private _settingsService: SettingsApiService
  ) { }

  servicesTableHeadings: string[] = ['Name', 'Age', 'Address', 'Action']

  listOfData: Employee[] = [];

  ngOnInit() {
    this.getEmployeesList()
  }

  getEmployeesList() {
    this._settingsService.getEmployees()
      .subscribe((data: Employee[]) => {
        this.listOfData = data;
      })
  }

}
