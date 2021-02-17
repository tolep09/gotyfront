import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VotarComponent } from './components/votar/votar.component';
import { VotacionComponent } from './components/votacion/votacion.component';

const routes: Routes = [
  { path: 'votar', component: VotarComponent },
  { path: 'votacion', component: VotacionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'votacion' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
