import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DemoApiService } from '../../services/demo-api.service';
import { PetStoreService } from '../../services/pet-store.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  private readonly petStore = inject(PetStoreService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly ownersCount = signal(0);
  readonly appointmentsCount = signal(0);
  readonly pendingAppointmentsCount = signal(0);
  readonly petsCount = computed(() => this.petStore.pets().length);
  readonly upcomingVaccines = computed(() =>
    this.petStore
      .pets()
      .filter((pet) => new Date(pet.vaccineDueDate).getTime() <= new Date('2026-04-15').getTime()),
  );

  ngOnInit(): void {
    forkJoin({
      owners: this.api.getOwners(),
      appointments: this.api.getAppointments(),
    })
      .pipe(
        catchError(() => {
          this.error.set('No se pudo cargar el dashboard desde APIs demo.');
          return of({ owners: [], appointments: [] });
        }),
      )
      .subscribe(({ owners, appointments }) => {
        this.ownersCount.set(owners.length);
        this.appointmentsCount.set(appointments.length);
        this.pendingAppointmentsCount.set(
          appointments.filter((appointment) => appointment.status === 'pending').length,
        );
        this.loading.set(false);
      });
  }
}
