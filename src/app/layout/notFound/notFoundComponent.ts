import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './notFoundComponent.html',
  styleUrls: ['./notFoundComponent.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NotFoundComponent implements OnInit {
  constructor(private router: Router) { }
  ngOnInit() { }
}
