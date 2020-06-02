import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowPageComponent} from './page/show-page/show-page.component';
import {MainComponent} from './main/main.component';
import {CreatePageComponent} from './page/create-page/create-page.component';
import {UpdatePageParentComponent} from './page/update-page-parent/update-page-parent.component';
import {ChoosePageComponent} from './page/choose-page/choose-page.component';
import {AddUserComponent} from './users/add-user/add-user.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LoginComponent} from './users/login/login.component';
import {AuthGuard} from './users/Auth/guards/auth.guard';
import {RoleGuard} from './users/Auth/guards/role.guard';


const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {path: 'showPage/:name', component: ShowPageComponent, canActivate: [AuthGuard]},
  {path: 'main', component: MainComponent},
  {path: 'createPage', component: CreatePageComponent, canActivate: [RoleGuard], data: {roles: ['master', 'admin']}},
  {path: 'updatePage/:name', component: UpdatePageParentComponent, canActivate: [RoleGuard], data: {roles: ['master', 'admin', 'mod']}},
  {path: 'choosePage', component: ChoosePageComponent, canActivate: [AuthGuard]},
  {path: 'addUser', component: AddUserComponent, canActivate: [RoleGuard], data: {roles: ['master', 'admin', 'mod']}},
  {path: 'login', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
