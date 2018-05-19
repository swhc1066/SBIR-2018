import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Rep } from './app.model';

@Component({
    selector: 'rep-form',
    template: `
      <h1>add rep</h1>
    `
})
export class RepFormComponent {

  @Input() model: Rep;

  show: boolean = false;

  constructor() { }

}
