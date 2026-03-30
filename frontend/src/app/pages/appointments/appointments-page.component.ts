import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Appointment, PaginationMeta, Pet, Veterinarian, VeterinaryService } from '../../models/types';
import { VetApiService } from '../../services/vet-api.service';
import {
  EntitySelectorModalComponent,
  SelectorColumn,
} from '../../shared/entity-selector-modal/entity-selector-modal.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { extractApiErrorMessage } from '../../shared/utils/http.utils';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    PaginationComponent,
    EntitySelectorModalComponent,
  ],
  templateUrl: './appointments-page.component.html',
  styleUrl: './appointments-page.component.scss',
})
export class AppointmentsPageComponent implements OnInit {
  private readonly api = inject(VetApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly services = signal<VeterinaryService[]>([]);
  readonly appointments = signal<Appointment[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly selectedServices = signal<number[]>([]);
  readonly editingId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly search = signal('');
  readonly message = signal('');
  readonly error = signal('');

  readonly selectedPet = signal<Pet | null>(null);
  readonly selectedVeterinarian = signal<Veterinarian | null>(null);

  readonly petSelectorOpen = signal(false);
  readonly petOptions = signal<Pet[]>([]);
  readonly petPagination = signal<PaginationMeta | null>(null);
  readonly petSearch = signal('');
  readonly petLoading = signal(false);

  readonly veterinarianSelectorOpen = signal(false);
  readonly veterinarianOptions = signal<Veterinarian[]>([]);
  readonly veterinarianPagination = signal<PaginationMeta | null>(null);
  readonly veterinarianSearch = signal('');
  readonly veterinarianLoading = signal(false);

  readonly petColumns: SelectorColumn[] = [
    { key: 'name', label: 'Mascota' },
    { key: 'species', label: 'Especie' },
    { key: 'client.full_name', label: 'Cliente' },
  ];

  readonly veterinarianColumns: SelectorColumn[] = [
    { key: 'full_name', label: 'Veterinario' },
    { key: 'specialty', label: 'Especialidad' },
    { key: 'license_number', label: 'Licencia' },
  ];

  readonly appointmentForm = this.formBuilder.nonNullable.group({
    pet_id: [0, Validators.min(1)],
    veterinarian_id: [0, Validators.min(1)],
    scheduled_at: ['', Validators.required],
    reason: ['', Validators.required],
    status: ['scheduled', Validators.required],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadData();
    this.loadPetOptions();
    this.loadVeterinarianOptions();
  }

  submit(): void {
    if (this.appointmentForm.invalid || !this.selectedPet() || !this.selectedVeterinarian()) {
      this.appointmentForm.markAllAsTouched();
      this.error.set('Selecciona mascota, veterinario, fecha y motivo.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.message.set('');

    const payload = {
      ...this.appointmentForm.getRawValue(),
      scheduled_at: this.normalizeDateTime(this.appointmentForm.getRawValue().scheduled_at),
      services: this.selectedServices().map((id) => ({ id, quantity: 1 })),
    };

    const isEditing = Boolean(this.editingId());
    const request$ = this.editingId()
      ? this.api.updateAppointment(this.editingId()!, payload)
      : this.api.createAppointment(payload);

    request$.subscribe({
      next: () => {
        this.message.set(isEditing ? 'Cita actualizada.' : 'Cita creada.');
        this.resetForm();
        this.loadData(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo guardar la cita.'));
        this.saving.set(false);
      },
    });
  }

  toggleService(serviceId: number, checked: boolean): void {
    this.selectedServices.update((selected) =>
      checked ? [...selected, serviceId] : selected.filter((id) => id !== serviceId),
    );
  }

  edit(appointment: Appointment): void {
    this.editingId.set(appointment.id);
    this.selectedPet.set(appointment.pet ?? null);
    this.selectedVeterinarian.set(appointment.veterinarian ?? null);
    this.selectedServices.set(appointment.services?.map((service) => service.id) ?? []);
    this.appointmentForm.patchValue({
      pet_id: appointment.pet_id,
      veterinarian_id: appointment.veterinarian_id,
      scheduled_at: appointment.scheduled_at.slice(0, 16),
      reason: appointment.reason,
      status: appointment.status,
      notes: appointment.notes ?? '',
    });
  }

  remove(appointment: Appointment): void {
    this.api.deleteAppointment(appointment.id).subscribe({
      next: () => {
        this.message.set(`Cita #${appointment.id} eliminada.`);
        this.loadData(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo eliminar la cita.'));
      },
    });
  }

  openPetSelector(): void {
    this.petSelectorOpen.set(true);
    this.loadPetOptions(this.petPagination()?.current_page ?? 1);
  }

  closePetSelector(): void {
    this.petSelectorOpen.set(false);
  }

  openVeterinarianSelector(): void {
    this.veterinarianSelectorOpen.set(true);
    this.loadVeterinarianOptions(this.veterinarianPagination()?.current_page ?? 1);
  }

  closeVeterinarianSelector(): void {
    this.veterinarianSelectorOpen.set(false);
  }

  selectPet(pet: Pet): void {
    this.selectedPet.set(pet);
    this.appointmentForm.patchValue({ pet_id: pet.id });
    this.closePetSelector();
  }

  selectVeterinarian(veterinarian: Veterinarian): void {
    this.selectedVeterinarian.set(veterinarian);
    this.appointmentForm.patchValue({ veterinarian_id: veterinarian.id });
    this.closeVeterinarianSelector();
  }

  onPetSearchChange(value: string): void {
    this.petSearch.set(value);
    this.loadPetOptions(1);
  }

  onVeterinarianSearchChange(value: string): void {
    this.veterinarianSearch.set(value);
    this.loadVeterinarianOptions(1);
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.loadData(1);
  }

  onPageChange(page: number): void {
    this.loadData(page);
  }

  onPetPageChange(page: number): void {
    this.loadPetOptions(page);
  }

  onVeterinarianPageChange(page: number): void {
    this.loadVeterinarianOptions(page);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  serviceSelected(serviceId: number): boolean {
    return this.selectedServices().includes(serviceId);
  }

  getServiceNames(appointment: Appointment): string {
    return appointment.services?.map((service) => service.name).join(', ') || 'Sin servicios';
  }

  private loadData(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      services: this.api.getVeterinaryServices(),
      appointments: this.api.getAppointments({ page, per_page: 8, search: this.search() }),
    }).subscribe({
      next: ({ services, appointments }) => {
        this.services.set(services);
        this.appointments.set(appointments.items);
        this.pagination.set(appointments.pagination);
        this.loading.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudieron cargar las citas.'));
        this.loading.set(false);
        this.saving.set(false);
      },
    });
  }

  private loadPetOptions(page = 1): void {
    this.petLoading.set(true);

    this.api.getPets({ page, per_page: 6, search: this.petSearch() }).subscribe({
      next: (response) => {
        this.petOptions.set(response.items);
        this.petPagination.set(response.pagination);
        this.petLoading.set(false);
      },
      error: () => this.petLoading.set(false),
    });
  }

  private loadVeterinarianOptions(page = 1): void {
    this.veterinarianLoading.set(true);

    this.api.getVeterinarians({ page, per_page: 6, search: this.veterinarianSearch() }).subscribe({
      next: (response) => {
        this.veterinarianOptions.set(response.items);
        this.veterinarianPagination.set(response.pagination);
        this.veterinarianLoading.set(false);
      },
      error: () => this.veterinarianLoading.set(false),
    });
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.selectedPet.set(null);
    this.selectedVeterinarian.set(null);
    this.selectedServices.set([]);
    this.appointmentForm.reset({
      pet_id: 0,
      veterinarian_id: 0,
      scheduled_at: '',
      reason: '',
      status: 'scheduled',
      notes: '',
    });
    this.saving.set(false);
    this.error.set('');
  }

  private normalizeDateTime(value: string): string {
    if (!value) {
      return value;
    }

    return value.length === 16 ? `${value.replace('T', ' ')}:00` : value.replace('T', ' ');
  }
}
