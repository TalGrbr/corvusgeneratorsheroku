import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateFormComponent} from './form/create-form/create-form.component';
import {UpdateFormPageComponent} from './form/update-form-page/update-form-page.component';
import {ShowPageComponent} from './page/show-page/show-page.component';
import {MainComponent} from './main/main.component';


const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'createForm', component: CreateFormComponent},
  {path: 'updateForm', component: UpdateFormPageComponent},
  {path: 'showPage', component: ShowPageComponent},
  {path: 'main', component: MainComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
