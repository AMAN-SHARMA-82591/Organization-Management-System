import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LeaveTrackerComponent } from './features/leave-tracker/leave-tracker.component';
import { OrganizationComponent } from './features/organization/organization.component';
import { ErrorPageComponent } from './features/error-page/error-page.component';
import { SelfServiceComponent } from './features/self-service/self-service.component';
import { DepartmentComponent } from './features/organization/components/department/department.component';
import { DesignationComponent } from './features/organization/components/designation/designation.component';
import { RolesComponent } from './features/organization/components/roles/roles.component';
import { EmployeeComponent } from './features/organization/components/employee/employee.component';
import { ProfileComponent } from './features/self-service/profile/profile.component';
import { TeamComponent } from './features/self-service/team/team.component';
import { CalendarComponent } from './features/self-service/calendar/calendar.component';
import { AuthComponent } from './features/auth/auth.component';
import { AuthGuard } from './features/auth/auth.guard';
import { RouteGuard } from './route-guards/route.guard';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { RmLeaveComponent } from './features/leave-tracker/component/rm-leave/rm-leave.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'leavetracker',
    canActivate: [AuthGuard],
    component: LeaveTrackerComponent,
  },
  {
    path: 'forget-password',
    component: ResetPasswordComponent,
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
  },
  {
    path: 'organization',
    canActivate: [AuthGuard],
    component: OrganizationComponent,
    children: [
      {
        path: 'department',
        component: DepartmentComponent,
        canMatch: [RouteGuard],
      },
      {
        path: 'designation',
        canMatch: [RouteGuard],
        component: DesignationComponent,
      },
      { path: 'roles', canMatch: [RouteGuard], component: RolesComponent },
      {
        path: 'users',
        canMatch: [RouteGuard],
        component: EmployeeComponent,
      },
      { path: '', redirectTo: 'department', pathMatch: 'full' },
    ],
  },
  {
    path: 'selfservice',
    component: SelfServiceComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'team', component: TeamComponent },
      { path: 'calendar', component: CalendarComponent },
      { path: 'leave_request', component: RmLeaveComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
    ],
  },
  { path: 'auth', component: AuthComponent },

  { path: 'not-found', component: ErrorPageComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
