import { Routes } from '@angular/router';
import { QuintaComponent } from './componentes-quinta/logica-quinta';

export const routes: Routes = [
  { path: 'cadastro', component: QuintaComponent },
  { path: '', redirectTo: '/cadastro', pathMatch: 'full' }
];
