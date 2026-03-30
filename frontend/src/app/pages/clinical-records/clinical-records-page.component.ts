import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { Appointment, ClinicalRecord, PaginationMeta, Pet, Veterinarian } from '../../models/types';
import { VetApiService } from '../../services/vet-api.service';
import {
  EntitySelectorModalComponent,
  SelectorColumn,
} from '../../shared/entity-selector-modal/entity-selector-modal.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { appendFormDataValue, extractApiErrorMessage } from '../../shared/utils/http.utils';

@Component({
  selector: 'app-clinical-records-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DatePipe,
    PaginationComponent,
    EntitySelectorModalComponent,
  ],
  templateUrl: './clinical-records-page.component.html',
  styleUrl: './clinical-records-page.component.scss',
})
export class ClinicalRecordsPageComponent implements OnInit {
  private readonly api = inject(VetApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly appointments = signal<Appointment[]>([]);
  readonly records = signal<ClinicalRecord[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly editingId = signal<number | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly search = signal('');
  readonly attachmentName = signal('');
  readonly selectedAttachment = signal<File | null>(null);
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

  readonly recordForm = this.formBuilder.nonNullable.group({
    pet_id: [0, Validators.min(1)],
    veterinarian_id: [0],
    appointment_id: [0],
    record_date: ['', Validators.required],
    diagnosis: ['', Validators.required],
    treatment: [''],
    observations: [''],
    weight: [0],
  });

  ngOnInit(): void {
    this.loadData();
    this.loadPetOptions();
    this.loadVeterinarianOptions();
  }

  submit(): void {
    if (this.recordForm.invalid || !this.selectedPet()) {
      this.recordForm.markAllAsTouched();
      this.error.set('Selecciona una mascota y completa diagnóstico y fecha.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.message.set('');

    const payload = this.buildFormData();
    const isEditing = Boolean(this.editingId());
    const request$ = this.editingId()
      ? this.api.updateClinicalRecord(this.editingId()!, payload)
      : this.api.createClinicalRecord(payload);

    request$.subscribe({
      next: () => {
        this.message.set(isEditing ? 'Historial actualizado.' : 'Historial creado.');
        this.resetForm();
        this.loadData(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo guardar el historial clínico.'));
        this.saving.set(false);
      },
    });
  }

  edit(record: ClinicalRecord): void {
    this.editingId.set(record.id);
    this.selectedPet.set(record.pet ?? null);
    this.selectedVeterinarian.set(record.veterinarian ?? null);
    this.attachmentName.set(record.attachment_url ? 'Adjunto actual disponible' : '');
    this.selectedAttachment.set(null);
    this.recordForm.patchValue({
      pet_id: record.pet_id,
      veterinarian_id: record.veterinarian_id ?? 0,
      appointment_id: record.appointment_id ?? 0,
      record_date: record.record_date,
      diagnosis: record.diagnosis,
      treatment: record.treatment ?? '',
      observations: record.observations ?? '',
      weight: Number(record.weight ?? 0),
    });
  }

  remove(record: ClinicalRecord): void {
    this.api.deleteClinicalRecord(record.id).subscribe({
      next: () => {
        this.message.set(`Historial #${record.id} eliminado.`);
        this.loadData(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo eliminar el historial clínico.'));
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
    this.recordForm.patchValue({ pet_id: pet.id });
    this.closePetSelector();
  }

  selectVeterinarian(veterinarian: Veterinarian): void {
    this.selectedVeterinarian.set(veterinarian);
    this.recordForm.patchValue({ veterinarian_id: veterinarian.id });
    this.closeVeterinarianSelector();
  }

  onAttachmentSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedAttachment.set(file);
    this.attachmentName.set(file?.name ?? '');
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.loadData(1);
  }

  onPetSearchChange(value: string): void {
    this.petSearch.set(value);
    this.loadPetOptions(1);
  }

  onVeterinarianSearchChange(value: string): void {
    this.veterinarianSearch.set(value);
    this.loadVeterinarianOptions(1);
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

  private loadData(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    forkJoin({
      appointments: this.api.getAppointments({ per_page: 100 }),
      records: this.api.getClinicalRecords({ page, per_page: 8, search: this.search() }),
    }).subscribe({
      next: ({ appointments, records }) => {
        this.appointments.set(appointments.items);
        this.records.set(records.items);
        this.pagination.set(records.pagination);
        this.loading.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudieron cargar los historiales clínicos.'));
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

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.recordForm.getRawValue();

    appendFormDataValue(formData, 'pet_id', values.pet_id);
    appendFormDataValue(formData, 'veterinarian_id', Number(values.veterinarian_id) || '');
    appendFormDataValue(formData, 'appointment_id', Number(values.appointment_id) || '');
    appendFormDataValue(formData, 'record_date', values.record_date);
    appendFormDataValue(formData, 'diagnosis', values.diagnosis);
    appendFormDataValue(formData, 'treatment', values.treatment);
    appendFormDataValue(formData, 'observations', values.observations);
    appendFormDataValue(formData, 'weight', Number(values.weight) || '');

    if (this.selectedAttachment()) {
      formData.append('attachment', this.selectedAttachment()!);
    }

    return formData;
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.selectedPet.set(null);
    this.selectedVeterinarian.set(null);
    this.selectedAttachment.set(null);
    this.attachmentName.set('');
    this.recordForm.reset({
      pet_id: 0,
      veterinarian_id: 0,
      appointment_id: 0,
      record_date: '',
      diagnosis: '',
      treatment: '',
      observations: '',
      weight: 0,
    });
    this.saving.set(false);
    this.error.set('');
  }
}
