import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Rep } from './app.model';
import { AwsService } from './aws.service';

@Component({
    templateUrl: './rep-list.component.html'
})
export class RepListComponent implements OnInit {

  rep: Rep;
  reps: Rep[] = [];

  constructor(private route: ActivatedRoute, private service: AwsService) { }

  ngOnInit(): void {
    this.rep = new Rep();
    this.service.getReps().subscribe(r => this.reps = r);
  }

  onSubmit(): void {
    this.service.saveRep(this.rep).subscribe(
      (rep) => {
        this.rep = new Rep();
        this.reps.push(rep);
      },
      (err) => {console.error(err)}
    );
  }

}
