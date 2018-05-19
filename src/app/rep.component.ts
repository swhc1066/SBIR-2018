import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Rep } from './app.model';

@Component({
    selector: 'rep',
    templateUrl: './rep.component.html'
})
export class RepComponent {

  @Input() model: Rep;
  @Input() requested: boolean;
  @Output() interview = new EventEmitter();

  show: boolean = false;

  constructor() { }

  talk(): void {
    this.requested = true;
    this.interview.emit(this.model);
  }

  cancel(): void {
    this.requested = false;
    this.interview.emit(this.model);
  }

}
