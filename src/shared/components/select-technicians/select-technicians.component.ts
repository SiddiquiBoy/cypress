import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { Technician } from 'src/app/modals/people/technician';

@Component({
  selector: 'app-select-technicians',
  templateUrl: './select-technicians.component.html',
  styleUrls: ['./select-technicians.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SelectTechniciansComponent implements OnInit {

  @Input() selectedTechnicians: Technician[];
  @Input() technicians: Technician[];

  @Output() emitSelectedTechnicians = new EventEmitter<any>();

  selectMaxCount: number;
  placeholder: string;

  constructor() { }

  ngOnInit() {
    this.placeholder = 'Select technicians';
    this.setSelectMaxCount();
  }

  setSelectMaxCount() {
    this.selectMaxCount = 3;
  }

  technicianUpdated() {
    this.emitSelectedTechnicians.emit(this.selectedTechnicians);
  }

}
