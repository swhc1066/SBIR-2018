import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { GranteeListComponent } from './grantee-list.component';
import { RepListComponent } from './rep-list.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'user/:id', component: GranteeListComponent },
  { path: 'rep', component: RepListComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
