import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from 'src/app/modals/people/employee';

const EMPLOYEE_FILE = 'assets/jsons/employees.json';

@Injectable({
  providedIn: 'root'
})
export class SettingsApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getEmployees() {
    return this.httpClient.get<Employee[]>(EMPLOYEE_FILE);
  }

}
