import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FirstStepComponent } from './components/first-step/first-step.component';
import { HomeComponent } from './components/home/home.component';
import { SpecMethodComponent } from './components/spec-method/spec-method.component';
import { SpecMethodGuard } from './core/guards/spec-method.guard';
import { SecondStepComponent } from './components/second-step/second-step.component';
import { FillGuard } from './core/guards/fill.guard';
import { ResultComponent } from './components/result/result.component';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'calc',
    component: FirstStepComponent
  },
  {
    path: 'spec-method',
    component: SpecMethodComponent,
    canActivate: [SpecMethodGuard]
  },
  {
    path: 'fill',
    component: SecondStepComponent,
    canActivate: [FillGuard]
  },
  {
    path: 'result',
    component: ResultComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
