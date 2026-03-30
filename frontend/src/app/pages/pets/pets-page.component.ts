import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Client, PaginationMeta, Pet } from '../../models/types';
import { VetApiService } from '../../services/vet-api.service';
import {
  EntitySelectorModalComponent,
  SelectorColumn,
} from '../../shared/entity-selector-modal/entity-selector-modal.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { appendFormDataValue, extractApiErrorMessage } from '../../shared/utils/http.utils';

@Component({
  selector: 'app-pets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent, EntitySelectorModalComponent],
  templateUrl: './pets-page.component.html',
  styleUrl: './pets-page.component.scss',
})
export class PetsPageComponent implements OnInit {
  private readonly api = inject(VetApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly pets = signal<Pet[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly search = signal('');
  readonly selectedClient = signal<Client | null>(null);
  readonly selectorOpen = signal(false);
  readonly clientOptions = signal<Client[]>([]);
  readonly clientPagination = signal<PaginationMeta | null>(null);
  readonly clientSearch = signal('');
  readonly clientLoading = signal(false);
  readonly photoPreview = signal<string | null>(null);
  readonly selectedPhoto = signal<File | null>(null);
  readonly message = signal('');
  readonly error = signal('');

  readonly clientColumns: SelectorColumn[] = [
    { key: 'full_name', label: 'Cliente' },
    { key: 'document_number', label: 'Documento' },
    { key: 'phone', label: 'Teléfono' },
  ];

  readonly petForm = this.formBuilder.nonNullable.group({
    client_id: [0, Validators.min(1)],
    name: ['', Validators.required],
    species: ['dog', Validators.required],
    breed: [''],
    sex: ['unknown'],
    birth_date: [''],
    weight: [0],
    color: [''],
    microchip_number: [''],
    allergies: [''],
    notes: [''],
    is_active: [true],
  });

  ngOnInit(): void {
    this.loadPets();
    this.loadClientOptions();
  }

  submit(): void {
    if (this.petForm.invalid || !this.selectedClient()) {
      this.petForm.markAllAsTouched();
      this.error.set('Selecciona un cliente y completa los datos requeridos.');
      return;
    }

    this.saving.set(true);
    this.error.set('');
    this.message.set('');

    const payload = this.buildFormData();
    const isEditing = Boolean(this.editingId());
    const request$ = this.editingId()
      ? this.api.updatePet(this.editingId()!, payload)
      : this.api.createPet(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadPets(this.pagination()?.current_page ?? 1);
        this.message.set(isEditing ? 'Mascota actualizada.' : 'Mascota creada.');
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo guardar la mascota.'));
        this.saving.set(false);
      },
    });
  }

  edit(pet: Pet): void {
    this.editingId.set(pet.id);
    this.selectedClient.set(pet.client ?? null);
    this.photoPreview.set(pet.photo_url);
    this.selectedPhoto.set(null);
    this.petForm.patchValue({
      client_id: pet.client_id,
      name: pet.name,
      species: pet.species,
      breed: pet.breed ?? '',
      sex: pet.sex ?? 'unknown',
      birth_date: pet.birth_date ?? '',
      weight: Number(pet.weight ?? 0),
      color: pet.color ?? '',
      microchip_number: pet.microchip_number ?? '',
      allergies: pet.allergies ?? '',
      notes: pet.notes ?? '',
      is_active: pet.is_active,
    });
  }

  remove(pet: Pet): void {
    this.api.deletePet(pet.id).subscribe({
      next: () => {
        this.message.set(`Mascota ${pet.name} eliminada.`);
        this.loadPets(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo eliminar la mascota.'));
      },
    });
  }

  openClientSelector(): void {
    this.selectorOpen.set(true);
    this.loadClientOptions(this.clientPagination()?.current_page ?? 1);
  }

  closeClientSelector(): void {
    this.selectorOpen.set(false);
  }

  selectClient(client: Client): void {
    this.selectedClient.set(client);
    this.petForm.patchValue({ client_id: client.id });
    this.selectorOpen.set(false);
  }

  onClientSearchChange(value: string): void {
    this.clientSearch.set(value);
    this.loadClientOptions(1);
  }

  onClientPageChange(page: number): void {
    this.loadClientOptions(page);
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.loadPets(1);
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedPhoto.set(file);
    this.photoPreview.set(file ? URL.createObjectURL(file) : null);
  }

  onPageChange(page: number): void {
    this.loadPets(page);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private loadPets(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getPets({ page, per_page: 8, search: this.search() }).subscribe({
      next: (response) => {
        this.pets.set(response.items);
        this.pagination.set(response.pagination);
        this.loading.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudieron cargar las mascotas.'));
        this.loading.set(false);
        this.saving.set(false);
      },
    });
  }

  private loadClientOptions(page = 1): void {
    this.clientLoading.set(true);

    this.api.getClients({ page, per_page: 6, search: this.clientSearch() }).subscribe({
      next: (response) => {
        this.clientOptions.set(response.items);
        this.clientPagination.set(response.pagination);
        this.clientLoading.set(false);
      },
      error: () => {
        this.clientLoading.set(false);
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.petForm.getRawValue();

    appendFormDataValue(formData, 'client_id', values.client_id);
    appendFormDataValue(formData, 'name', values.name);
    appendFormDataValue(formData, 'species', values.species);
    appendFormDataValue(formData, 'breed', values.breed);
    appendFormDataValue(formData, 'sex', values.sex);
    appendFormDataValue(formData, 'birth_date', values.birth_date);
    appendFormDataValue(formData, 'weight', values.weight);
    appendFormDataValue(formData, 'color', values.color);
    appendFormDataValue(formData, 'microchip_number', values.microchip_number);
    appendFormDataValue(formData, 'allergies', values.allergies);
    appendFormDataValue(formData, 'notes', values.notes);
    appendFormDataValue(formData, 'is_active', values.is_active ? 1 : 0);

    if (this.selectedPhoto()) {
      formData.append('photo', this.selectedPhoto()!);
    }

    return formData;
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.selectedClient.set(null);
    this.photoPreview.set(null);
    this.selectedPhoto.set(null);
    this.petForm.reset({
      client_id: 0,
      name: '',
      species: 'dog',
      breed: '',
      sex: 'unknown',
      birth_date: '',
      weight: 0,
      color: '',
      microchip_number: '',
      allergies: '',
      notes: '',
      is_active: true,
    });
    this.saving.set(false);
    this.error.set('');
  }
}
