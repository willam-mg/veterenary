import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { AppointmentsPageComponent } from './pages/appointments/appointments-page.component';
import { ClientsPageComponent } from './pages/clients/clients-page.component';
import { ClinicalRecordsPageComponent } from './pages/clinical-records/clinical-records-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page.component';
import { LoginPageComponent } from './pages/login/login-page.component';
import { PetsPageComponent } from './pages/pets/pets-page.component';
import { RegisterPageComponent } from './pages/register/register-page.component';
import { VeterinariansPageComponent } from './pages/veterinarians/veterinarians-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
  { path: 'clients', component: ClientsPageComponent, canActivate: [authGuard] },
  { path: 'veterinarians', component: VeterinariansPageComponent, canActivate: [authGuard] },
  { path: 'pets', component: PetsPageComponent, canActivate: [authGuard] },
  { path: 'appointments', component: AppointmentsPageComponent, canActivate: [authGuard] },
  { path: 'clinical-records', component: ClinicalRecordsPageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'dashboard' },
];
