import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Grantee } from './app.model';

@Component({
    selector: 'panel',
    templateUrl: './panel.component.html'
})
export class PanelComponent {

  @Input() model: Grantee;
  @Input() requested: boolean;
  @Input() complete: boolean;
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
