import { Routes } from '@angular/router';

import { AppointmentsPageComponent } from './pages/appointments/appointments-page.component';
import { ClientsPageComponent } from './pages/clients/clients-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { PetDetailPageComponent } from './pages/pet-detail/pet-detail-page.component';
import { PetsPageComponent } from './pages/pets/pets-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'pets', component: PetsPageComponent },
  { path: 'pets/:id', component: PetDetailPageComponent },
  { path: 'clients', component: ClientsPageComponent },
  { path: 'appointments', component: AppointmentsPageComponent },
  { path: '**', redirectTo: 'dashboard' },
];
