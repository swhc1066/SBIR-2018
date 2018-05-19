import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AwsService } from './aws.service';
import { HomeComponent } from './home.component';
import { PanelComponent } from './panel.component';
import { GranteeListComponent } from './grantee-list.component';
import { RepListComponent } from './rep-list.component';
import { RepComponent } from './rep.component';
import { RepFormComponent } from './rep-form.component';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule
    , HttpModule
    , JsonpModule
    , FormsModule
    , AppRoutingModule
  ],
  declarations: [
    AppComponent, HomeComponent, PanelComponent, GranteeListComponent, RepListComponent, RepComponent, RepFormComponent
  ],
  providers: [ AwsService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
