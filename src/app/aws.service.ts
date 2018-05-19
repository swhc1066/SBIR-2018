import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/retry';

import { Grantee, Rep } from './app.model';

const PROD: string = 'https://bq5d3iy5z8.execute-api.us-east-1.amazonaws.com/prod';
const TEST: string = 'https://osxpenlv9h.execute-api.us-east-1.amazonaws.com/test';
const DEV: string = 'https://occ564gy46.execute-api.us-east-1.amazonaws.com/dev';

export function cacheable<T>(o: Observable<T>): Observable<T> {
  let replay = new ReplaySubject<T>(1);
  o.subscribe(
    x => replay.next(x),
    x => replay.error(x),
    () => replay.complete()
  );
  return replay.asObservable();
}

@Injectable()
export class AwsService {

  uri: string = PROD;
  private _grantees: Observable<Grantee[]>;

  constructor(private http: Http) {}

  saveGrantee(g: Grantee): Observable<Grantee> {
    const url = `${this.uri}/grantee/`;
    return this.http.post(url, JSON.stringify(g))
      .map(res => res.json() as Grantee);
  }

  getGrantee(id: number): Observable<Grantee> {
    const url = `${this.uri}/grantee/${id}`;
    return this.http.get(url).retry()
      .map(res => res.json() as Grantee);
  }

  getGrantees(): Observable<Grantee[]> {
    if (this._grantees)
      return this._grantees;
    const url = `${this.uri}/grantee`;
    return this._grantees = cacheable<Grantee[]>(
      this.http.get(url).retry()
        .map(res => res.json() as Grantee[])
        .map(grantees => grantees.map(g => this.scrubGrantee(g)))
    );
  }

  scrubGrantee(grantee: Grantee): Grantee {
    grantee.topic = grantee.topic.replace(/"/g, '');
    grantee.organization = grantee.organization.replace(/"/g, '');
    grantee.title = grantee.title.replace(/"/g, '');
    grantee.abs = grantee.abs.replace(/"/g, '');
    grantee.abs = grantee.abs.replace(/<br\/>/g, ' ');
    return grantee;
  }

  saveRep(r: Rep): Observable<Rep> {
    const url = `${this.uri}/rep/`;
    return this.http.post(url, JSON.stringify(r))
      .map(res => res.json() as Rep);
  }

  getRep(uuid: string): Observable<Rep> {
    const url = `${this.uri}/rep/${uuid}`;
    return this.http.get(url).retry()
      .map(res => res.json() as Rep);
  }

  getReps(): Observable<Rep[]> {
    const url = `${this.uri}/rep?key=slkbg21!lak`;
    return this.http.get(url).retry(3)
      .map(res => res.json() as Rep[]);
  }

}
