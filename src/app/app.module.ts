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
import {UpdateFormParentComponent} from './form/update-form-parent/update-form-parent.component';

import {EditorModule} from '@tinymce/tinymce-angular';
import {UpdateTemplateComponent} from './update-template/update-template.component';
import {ShowPageComponent} from './page/show-page/show-page.component';
import {CreatePageComponent} from './page/create-page/create-page.component';
import {UpdatePageComponent} from './page/update-page/update-page.component';
import {UpdatePageParentComponent} from './page/update-page-parent/update-page-parent.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {QuestionControlService} from './form/form-services/question-control.service';
import {ChoosePageComponent} from './page/choose-page/choose-page.component';
import {SafeHtmlPipe} from './page/pipes/safe-html.pipe';
import {ForbiddenValidatorDirective} from './utilities/custom-validators/forbidden-name.directive';
import {ManageUsersComponent} from './users/manage-users/manage-users.component';
import {LoginComponent} from './users/login/login.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthInterceptor} from './users/Auth/interceptors/auth.interceptor';
import { ManageModsComponent } from './users/manage-mods/manage-mods.component';

@NgModule({
  declarations: [
    AppComponent,
    MainFormQuestionComponent,
    MainFormComponent,
    CreateFormComponent,
    MainComponent,
    UpdateFormComponent,
    UpdateFormParentComponent,
    UpdateTemplateComponent,
    ShowPageComponent,
    CreatePageComponent,
    UpdatePageComponent,
    UpdatePageParentComponent,
    ChoosePageComponent,
    SafeHtmlPipe,
    ForbiddenValidatorDirective,
    ManageUsersComponent,
    LoginComponent,
    PageNotFoundComponent,
    ManageModsComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    EditorModule,
    HttpClientModule
  ],
  providers: [
    QuestionControlService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
