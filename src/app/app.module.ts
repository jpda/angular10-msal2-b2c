import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MsalService, MSAL_INSTANCE, MsalGuard, MsalInterceptor, MsalBroadcastService } from './msal';
import { IPublicClientApplication, PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { MSAL_GUARD_CONFIG, MSAL_INTERCEPTOR_CONFIG } from './msal/constants';
import { MsalGuardConfiguration } from './msal/msal.guard.config';
import { MsalInterceptorConfig } from './msal/msal.interceptor.config';

function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: '7ea11c41-36fb-487a-8624-75ea42e47b0a',
      redirectUri: 'http://localhost:4200/',
      // this is the authority for sign-in - should reflect your sign-in/sign-up policy (B2C_1_susi_rec in my example)
      authority: 'https://jpdab2c.b2clogin.com/jpdab2c.onmicrosoft.com/B2C_1_susi_rec',
      // if you are using other policies (like password reset, profile editing, alternate login, etc),
      // make sure those are added into the knownAuthorities array in addition to the main authority
      knownAuthorities: ['https://jpdab2c.b2clogin.com/jpdab2c.onmicrosoft.com/B2C_1_susi_rec']
    }
  });
}

function MSALInterceptorConfigFactory(): MsalInterceptorConfig {
  const protectedResourceMap = new Map<string, Array<string>>();
  //protectedResourceMap.set('https://jpdab2c.onmicrosoft.com/angular-v2/access_as_user', ['https://jpdab2c.onmicrosoft.com/angular-v2/access_as_user']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap,
  };
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatButtonModule,
    MatToolbarModule,
    MatListModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useValue: {
        interactionType: InteractionType.Popup
      } as MsalGuardConfiguration
    },
    {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    MsalGuard,
    MsalBroadcastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
