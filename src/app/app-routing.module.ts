import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ShowPageComponent} from './page/show-page/show-page.component';
import {MainComponent} from './main/main.component';
import {CreatePageComponent} from './page/create-page/create-page.component';
import {UpdatePageParentComponent} from './page/update-page-parent/update-page-parent.component';
import {ChoosePageComponent} from './page/choose-page/choose-page.component';
import {ManageUsersComponent} from './users/management/manage-users/manage-users.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {LoginComponent} from './users/login/login.component';
import {AuthGuard} from './users/Auth/guards/auth.guard';
import {PageRoleGuard} from './users/Auth/guards/page-role.guard';
import {ManageModsComponent} from './users/management/manage-mods/manage-mods.component';
import {ManageSubAdminsComponent} from './users/management/manage-sub-admins/manage-sub-admins.component';
import {ManageAdminsComponent} from './users/management/manage-admins/manage-admins.component';
import {ManagePageAdminComponent} from './users/management/manage-page-admin/manage-page-admin.component';
import {ManagePageUsersComponent} from './users/management/manage-page-users/manage-page-users.component';
import {WebsiteRoleGuard} from './users/Auth/guards/website-role.guard';


const routes: Routes = [
  {path: '', redirectTo: 'main', pathMatch: 'full'},
  {
    path: 'showPage/:name',
    component: ShowPageComponent,
    canActivate: [PageRoleGuard],
    data: {roles: ['master', 'admin', 'sub_admin', 'mod', 'user']}
  },
  {path: 'main', component: MainComponent},
  {path: 'createPage', component: CreatePageComponent, canActivate: [WebsiteRoleGuard], data: {roles: ['master', 'admin']}},
  {
    path: 'updatePage/:name',
    component: UpdatePageParentComponent,
    canActivate: [PageRoleGuard],
    data: {roles: ['master', 'admin', 'sub_admin', 'mod']}
  },
  {path: 'choosePage', component: ChoosePageComponent, canActivate: [AuthGuard]},
  {path: 'manageUsers', component: ManageUsersComponent, canActivate: [WebsiteRoleGuard], data: {roles: ['master', 'admin', 'mod']}},
  {path: 'manageMods/:name', component: ManageModsComponent, canActivate: [PageRoleGuard], data: {roles: ['master', 'admin', 'sub_admin']}},
  {path: 'manageSubAdmins/:name', component: ManageSubAdminsComponent, canActivate: [PageRoleGuard], data: {roles: ['master', 'admin']}},
  {path: 'manageAdmins', component: ManageAdminsComponent, canActivate: [WebsiteRoleGuard], data: {roles: ['master']}},
  {path: 'managePageAdmin/:name', component: ManagePageAdminComponent, canActivate: [PageRoleGuard], data: {roles: ['master']}},
  {
    path: 'managePageUsers/:name',
    component: ManagePageUsersComponent,
    canActivate: [PageRoleGuard],
    data: {roles: ['master', 'admin', 'sub_admin', 'mod']}
  },
  {path: 'login', component: LoginComponent},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
