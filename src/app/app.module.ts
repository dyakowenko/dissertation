import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { SpecMethodComponent } from './components/spec-method/spec-method.component';

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBDsxJCI_m6ph8ZpR0HSEoOtgJRhLBiBNw',
  authDomain: 'yakovdisser.firebaseapp.com',
  databaseURL: 'https://yakovdisser.firebaseio.com',
  projectId: 'yakovdisser',
  storageBucket: 'yakovdisser.appspot.com',
  messagingSenderId: '653063747654',
  // appId: '1:653063747654:web:24fc468e31824d28563247'
};

@NgModule({
  declarations: [
    AppComponent,
    FirstStepComponent,
    HomeComponent,
    SpecMethodComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireDatabaseModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
