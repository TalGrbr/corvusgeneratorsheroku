import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MainFormQuestionComponent} from './form/main-form-question/main-form-question.component';
import {MainFormComponent} from './form/main-form/main-form.component';
import {CreateFormComponent} from './form/create-form/create-form.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {MainComponent} from './main/main.component';
import {UpdateFormComponent} from './form/update-form/update-form.component';
import {UpdateFormPageComponent} from './form/update-form-page/update-form-page.component';

import {EditorModule} from '@tinymce/tinymce-angular';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { ShowPageComponent } from './page/show-page/show-page.component';
import { CreatePageComponent } from './page/create-page/create-page.component';
import { UpdatePageComponent } from './page/update-page/update-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFormQuestionComponent,
    MainFormComponent,
    CreateFormComponent,
    MainComponent,
    UpdateFormComponent,
    UpdateFormPageComponent,
    UpdateTemplateComponent,
    ShowPageComponent,
    CreatePageComponent,
    UpdatePageComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    EditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
