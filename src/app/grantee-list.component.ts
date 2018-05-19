import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { Grantee, Rep, Req } from './app.model';
import { AwsService } from './aws.service';

@Component({
    templateUrl: './grantee-list.component.html',
    styles: [`
      @media(max-width: 767px) {
        .navpad {
          padding-top:157px;
        }
        .sidebar-offcanvas {
          top:157px;
        }
      }
      @media(min-width: 768px) {
        .sidebar-offcanvas {
          position:fixed;right:0;
        }
      }
    `]
})
export class GranteeListComponent implements OnInit {

  rep: Rep;
  grantees: Grantee[];
  topics: string[];
  topic: string = undefined;
  show: boolean = false;
  offcanvasToggle: boolean = false;
  review: boolean = false;
  searchTerm: string;
  private searchTerms = new Subject<string>();

  constructor(private route: ActivatedRoute, private service: AwsService) { }

  ngOnInit(): void {
    let id = this.route.snapshot.params['id'];
    this.service.getRep(id).subscribe(r => {
      this.rep = r;
      if (r.selectionsComplete)
        this.preview();
      else
        this.service.getGrantees().subscribe(g => {
          this.granteesInit(g);
          this.topics = this.topicsInit(g);
        });
    });

    this.searchTerms
      .debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => term ? Observable.of(this.fullTextSearch(this.grantees, term)) : this.service.getGrantees().map(g => this.topic ? this.filter(g, this.topic) : g))
      .catch(error => {
        console.error(error);
        return this.service.getGrantees();
      })
      .subscribe(g => this.granteesInit(g));
  }

  private granteesInit(grantees: Grantee[]): void {
    this.grantees = grantees;
  }

  topicsInit(grantees: Grantee[]): string[] {
    let hits: any = {};
    return grantees.filter(g => {
        if (!hits[g.topic]) {
          hits[g.topic] = true;
          return true;
        }
        return false;
      })
      .map(g => g.topic)
      .sort();
  }

  view(): void {
    this.show = true;
    window.scroll(0,0);
  }

  reset(): void {
    this.topic = undefined;
    this.searchTerm = undefined;
    this.service.getGrantees().subscribe(g => this.granteesInit(g));
  }

  // Push a search term into the observable stream.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  private fullTextSearch(grantees: Grantee[], term: string): Grantee[] {
    return grantees.filter(g => {
      return (g.title.indexOf(term) > -1) || (g.abs.indexOf(term) > -1);
    });
  }

  select(topic: string): void {
    this.offcanvasToggle = false;
    if (this.topic === undefined) {
      this.topic = topic;
      this.granteesInit(this.filter(this.grantees, this.topic));
    } else if (this.topic === topic) {
      this.topic = undefined;
      this.service.getGrantees().map(g => this.searchTerm ? this.fullTextSearch(g, this.searchTerm) : g).subscribe(g => this.granteesInit(g));
    } else {
      this.topic = topic;
      this.service.getGrantees().map(g => this.searchTerm ? this.fullTextSearch(g, this.searchTerm) : g).map(g => this.filter(g, this.topic)).subscribe(g => this.granteesInit(g));
    }
  }

  private filter(grantees: Grantee[], topic: string): Grantee[] {
    return grantees.filter(g => g.topic === topic);
  }

  setupInterview(grantee: Grantee): void {
    if (this.isOnTheList(grantee)) {
      let reqs = this.rep.interviewRequests.filter(req => req.nsfAwardId !== grantee.nsfAwardId);
      this.rep.interviewRequests = reqs;
    } else {
      let req = new Req();
      req.nsfAwardId = grantee.nsfAwardId;
      if (! this.rep.interviewRequests) this.rep.interviewRequests = [];
      this.rep.interviewRequests.push(req);
    }
    this.service.saveRep(this.rep).subscribe(r => this.rep = r);
  }

  isOnTheList(grantee: Grantee): boolean {
    if (! this.rep.interviewRequests) return false;
    let req = this.rep.interviewRequests.find(req => req.nsfAwardId === grantee.nsfAwardId);
    return req !== undefined;
  }

  hasInterviews(): boolean {
    return this.rep && this.rep.interviewRequests && this.rep.interviewRequests.length > 0;
  }

  preview(): void {
    if (! this.rep.interviewRequests) return
    this.review = true;
    this.service.getGrantees().map(s => s.filter(g => this.isOnTheList(g))).subscribe(g => this.grantees = g);
    window.scroll(0,0);
  }

  complete(): void {
    if (this.hasInterviews()) {
      this.rep.selectionsComplete = true;
      this.service.saveRep(this.rep).subscribe(r => this.rep = r);
    }
  }

}
