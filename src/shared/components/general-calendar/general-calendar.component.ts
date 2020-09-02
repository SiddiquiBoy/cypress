import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { CalendarView, CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-general-calendar',
  templateUrl: './general-calendar.component.html',
  styleUrls: ['./general-calendar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GeneralCalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  showInfoDialog: boolean = false;
  eventInfo: any;
  activeDayIsOpen: boolean = true;
  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: new Date('2020-07-15T07:40:22.080Z'),
      title: 'Electrical fitting by Mark Twain',
      color: colors.yellow,
      meta: {
        technician: 'Mark Twain',
        businessUnit: 'Electrical Department',
        address: 'S-345, Hanock Street, USA',
        phone: '(543) 999-3888',
        jobType: 'Panel Installation',
        description: 'Remove existing 200Amp panel, remove all existing wirings and circuit breakers as needed, install and mount new 200Amp panel, reinstall all existing wiring into new panel, install all new circuit breakers, properly identify and label all cicuit breakers. We will run all new circuitory. At each location we will install a disconnect. Each circuit will be 30A 208V.'
      },
    },
    {
      start: new Date('2020-07-30T07:40:22.080Z'),
      title: 'Plumbing work by Rick, Jared and Smith',
      color: colors.blue,
      meta: {
        technician: 'Richard Branson',
        businessUnit: 'Electrical Department',
        address: 'S-345, Florida, USA',
        phone: '(543) 999-3666',
        jobType: 'Solar Panel Installation',
        description: 'Remove existing 200Amp panel, remove all existing wirings and circuit breakers as needed, install and mount new 200Amp panel, reinstall all existing wiring into new panel, install all new circuit breakers, properly identify and label all cicuit breakers. We will run all new circuitory. At each location we will install a disconnect. Each circuit will be 30A 208V.'
      },
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: new Date(),
      title: 'Electrical fitting by Richard',
      color: colors.red,
      meta: {
        technician: 'Richard',
        businessUnit: 'Electrical Department',
        address: 'S-345, Hanock Street, USA',
        phone: '(543) 999-3888',
        jobType: 'Panel Installation Work',
        description: 'Remove existing 200Amp panel, remove all existing wirings and circuit breakers as needed, install and mount new 200Amp panel, reinstall all existing wiring into new panel, install all new circuit breakers, properly identify and label all cicuit breakers. We will run all new circuitory. At each location we will install a disconnect. Each circuit will be 30A 208V.'
      },
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  handleEvent(action: string, event: Event) {
    console.log(action, event);
    let info: any = event;
    this.eventInfo = info.meta;
    this.showInfoDialog = true;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  onCancelClick() {
    this.showInfoDialog = false;
  }

}
