import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateFormComponent} from './form/create-form/create-form.component';
import {UpdateFormParentComponent} from './form/update-form-parent/update-form-parent.component';
import {ShowPageComponent} from './page/show-page/show-page.component';
import {MainComponent} from './main/main.component';
import {CreatePageComponent} from './page/create-page/create-page.component';
import {UpdatePageParentComponent} from './page/update-page-parent/update-page-parent.component';
import {ChoosePageComponent} from './page/choose-page/choose-page.component';


const routes: Routes = [
  {path: '', redirectTo: '/main', pathMatch: 'full'},
  {path: 'showPage/:name', component: ShowPageComponent},
  {path: 'main', component: MainComponent},
  {path: 'createPage', component: CreatePageComponent},
  {path: 'updatePage', component: UpdatePageParentComponent},
  {path: 'choosePage', component: ChoosePageComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
