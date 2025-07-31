import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './common/footer/footer.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { HomeComponent } from './features/home/home.component';
import { LeaveTrackerComponent } from './features/leave-tracker/leave-tracker.component';
import { OrganizationComponent } from './features/organization/organization.component';
import { ErrorPageComponent } from './features/error-page/error-page.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { ModalComponent } from './common/modal/modal.component';
import { TabsComponent } from './common/tabs/tabs.component';
import { DepartmentComponent } from './features/organization/components/department/department.component';
import { DesignationComponent } from './features/organization/components/designation/designation.component';
import { RolesComponent } from './features/organization/components/roles/roles.component';
import { TableComponent } from './common/table/table.component';
import { EmployeeComponent } from './features/organization/components/employee/employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelfServiceComponent } from './features/self-service/self-service.component';
import { ProfileComponent } from './features/self-service/profile/profile.component';
import { TeamComponent } from './features/self-service/team/team.component';
import { CalendarComponent } from './features/self-service/calendar/calendar.component';
import { ProfileMenuComponent } from './common/navbar/profile-menu/profile-menu.component';
import { CardProfileComponent } from './common/card/card-profile/card-profile.component';
import { CardListComponent } from './common/card/card-list/card-list.component';
import { CardHeaderComponent } from './common/card/card-header/card-header.component';
import { CardLeaveComponent } from './common/card/card-leave/card-leave.component';
import { DialogLeaveComponent } from './common/dialog/dialog-leave/dialog-leave.component';
import { AuthComponent } from './features/auth/auth.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AlertComponent } from './shared/alert/alert.component';
import { AuthInterceptor } from './features/auth/auth.interceptor';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MsalBroadcastService,
  MsalGuard,
  MsalGuardConfiguration,
  MsalModule,
  MsalRedirectComponent,
  MsalService,
} from '@azure/msal-angular';
import {
  BrowserCacheLocation,
  IPublicClientApplication,
  InteractionType,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';
import { msalConfig } from './features/auth/auth.config';
import {
  SocialLoginModule,
  SocialAuthServiceConfig,
  GoogleLoginProvider,
  GoogleSigninButtonDirective,
} from '@abacritt/angularx-social-login';
import { environment } from 'src/environments/environment';
import { CardOptionbarComponent } from './common/card/card-optionbar/card-optionbar.component';
import { ModalFormComponent } from './common/modal/modal-form/modal-form.component';
import { ClickOutsideDirective } from './shared/directives/click-outside.directive';
import { CardBarComponent } from './common/card/card-bar/card-bar.component';
import { SearchFilterComponent } from './common/search-filter/search-filter.component';
import { LoaderComponent } from './common/loader/loader.component';
import { PaginationComponent } from './common/pagination/pagination.component';
import { DeleteComponent } from './common/table-actions/delete/delete.component';
import { TooltipComponent } from './common/tooltip/tooltip.component';
import { SearchSelectComponent } from './common/search-select/search-select.component';
import { ManageRmComponent } from './features/organization/components/manage-rm/manage-rm.component';
import { ForgotPassowrdComponent } from './features/auth/components/forgot-passowrd/forgot-passowrd.component';
import { ResetPasswordComponent } from './features/reset-password/reset-password.component';
import { DialogApproveLeaveRequest } from './common/dialog/dialog-approveLeaveRequest/dialog-approveLeaveRequest.component';
import { RmLeaveComponent } from './features/leave-tracker/component/rm-leave/rm-leave.component';
import { ChangePasswordComponent } from './features/change-password/change-password.component';

const isIE =
  window.navigator.userAgent.indexOf('MSIE ') > -1 ||
  window.navigator.userAgent.indexOf('Trident/') > -1;

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
  };
}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    SidebarComponent,
    HomeComponent,
    LeaveTrackerComponent,
    OrganizationComponent,
    ErrorPageComponent,
    NavbarComponent,
    ModalComponent,
    TabsComponent,
    DepartmentComponent,
    DesignationComponent,
    RolesComponent,
    TableComponent,
    EmployeeComponent,
    SelfServiceComponent,
    ProfileComponent,
    TeamComponent,
    CalendarComponent,
    ProfileMenuComponent,
    CardProfileComponent,
    CardListComponent,
    CardHeaderComponent,
    CardLeaveComponent,
    DialogLeaveComponent,
    DialogApproveLeaveRequest,
    AuthComponent,
    AlertComponent,
    CardOptionbarComponent,
    ModalFormComponent,
    ClickOutsideDirective,
    CardBarComponent,
    SearchFilterComponent,
    LoaderComponent,
    PaginationComponent,
    DeleteComponent,
    TooltipComponent,
    SearchSelectComponent,
    ManageRmComponent,
    ForgotPassowrdComponent,
    ResetPasswordComponent,
    RmLeaveComponent,
    ChangePasswordComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MsalModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot({
      closeButton: true,
      timeOut: 3000,
      progressBar: true,
      positionClass: 'toast-bottom-right',
    }),
    SocialLoginModule,
  ],
  providers: [
    GoogleSigninButtonDirective,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService,

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId, {
              oneTapEnabled: false,
            }),
          },
        ],
        onError: (err) => {
          console.error(err);
        },
      } as SocialAuthServiceConfig,
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent, MsalRedirectComponent],
})
export class AppModule {}
