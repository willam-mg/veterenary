import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PaginationMeta, Veterinarian } from '../../models/types';
import { VetApiService } from '../../services/vet-api.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { appendFormDataValue, extractApiErrorMessage } from '../../shared/utils/http.utils';

@Component({
  selector: 'app-veterinarians-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './veterinarians-page.component.html',
  styleUrl: './veterinarians-page.component.scss',
})
export class VeterinariansPageComponent implements OnInit {
  private readonly api = inject(VetApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly veterinarians = signal<Veterinarian[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly search = signal('');
  readonly photoPreview = signal<string | null>(null);
  readonly selectedPhoto = signal<File | null>(null);
  readonly message = signal('');
  readonly error = signal('');

  readonly veterinarianForm = this.formBuilder.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    license_number: ['', Validators.required],
    specialty: [''],
    is_active: [true],
  });

  ngOnInit(): void {
    this.loadVeterinarians();
  }

  submit(): void {
    if (this.veterinarianForm.invalid) {
      this.veterinarianForm.markAllAsTouched();
      this.error.set('Completa los datos obligatorios del veterinario.');
      return;
    }

    this.saving.set(true);
    this.message.set('');
    this.error.set('');

    const payload = this.buildFormData();
    const isEditing = Boolean(this.editingId());
    const request$ = this.editingId()
      ? this.api.updateVeterinarian(this.editingId()!, payload)
      : this.api.createVeterinarian(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadVeterinarians(this.pagination()?.current_page ?? 1);
        this.message.set(isEditing ? 'Veterinario actualizado.' : 'Veterinario creado.');
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo guardar el veterinario.'));
        this.saving.set(false);
      },
    });
  }

  edit(veterinarian: Veterinarian): void {
    this.editingId.set(veterinarian.id);
    this.photoPreview.set(veterinarian.photo_url);
    this.selectedPhoto.set(null);
    this.veterinarianForm.patchValue({
      first_name: veterinarian.first_name,
      last_name: veterinarian.last_name,
      email: veterinarian.email,
      phone: veterinarian.phone ?? '',
      license_number: veterinarian.license_number,
      specialty: veterinarian.specialty ?? '',
      is_active: veterinarian.is_active,
    });
  }

  remove(veterinarian: Veterinarian): void {
    this.api.deleteVeterinarian(veterinarian.id).subscribe({
      next: () => {
        this.message.set(`Veterinario ${veterinarian.full_name} eliminado.`);
        this.loadVeterinarians(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo eliminar el veterinario.'));
      },
    });
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.loadVeterinarians(1);
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedPhoto.set(file);
    this.photoPreview.set(file ? URL.createObjectURL(file) : null);
  }

  onPageChange(page: number): void {
    this.loadVeterinarians(page);
  }

  cancelEdit(): void {
    this.resetForm();
  }

  private loadVeterinarians(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getVeterinarians({ page, per_page: 8, search: this.search() }).subscribe({
      next: (response) => {
        this.veterinarians.set(response.items);
        this.pagination.set(response.pagination);
        this.loading.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudieron cargar los veterinarios.'));
        this.loading.set(false);
        this.saving.set(false);
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.veterinarianForm.getRawValue();

    appendFormDataValue(formData, 'first_name', values.first_name);
    appendFormDataValue(formData, 'last_name', values.last_name);
    appendFormDataValue(formData, 'email', values.email);
    appendFormDataValue(formData, 'phone', values.phone);
    appendFormDataValue(formData, 'license_number', values.license_number);
    appendFormDataValue(formData, 'specialty', values.specialty);
    appendFormDataValue(formData, 'is_active', values.is_active ? 1 : 0);

    if (this.selectedPhoto()) {
      formData.append('photo', this.selectedPhoto()!);
    }

    return formData;
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.photoPreview.set(null);
    this.selectedPhoto.set(null);
    this.veterinarianForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      license_number: '',
      specialty: '',
      is_active: true,
    });
    this.saving.set(false);
    this.error.set('');
  }
}
