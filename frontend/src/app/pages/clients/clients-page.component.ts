import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Client, PaginationMeta } from '../../models/types';
import { VetApiService } from '../../services/vet-api.service';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { appendFormDataValue, extractApiErrorMessage } from '../../shared/utils/http.utils';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PaginationComponent],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss',
})
export class ClientsPageComponent implements OnInit {
  private readonly api = inject(VetApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly clients = signal<Client[]>([]);
  readonly pagination = signal<PaginationMeta | null>(null);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly search = signal('');
  readonly photoPreview = signal<string | null>(null);
  readonly selectedPhoto = signal<File | null>(null);
  readonly message = signal('');
  readonly error = signal('');

  readonly clientForm = this.formBuilder.nonNullable.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    email: [''],
    phone: ['', Validators.required],
    document_number: [''],
    address: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.loadClients();
  }

  submit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      this.error.set('Completa los campos obligatorios antes de guardar.');
      return;
    }

    this.saving.set(true);
    this.message.set('');
    this.error.set('');

    const payload = this.buildFormData();
    const isEditing = Boolean(this.editingId());
    const request$ = this.editingId()
      ? this.api.updateClient(this.editingId()!, payload)
      : this.api.createClient(payload);

    request$.subscribe({
      next: () => {
        this.resetForm();
        this.loadClients(this.pagination()?.current_page ?? 1);
        this.message.set(isEditing ? 'Cliente actualizado.' : 'Cliente creado.');
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo guardar el cliente.'));
        this.saving.set(false);
      },
    });
  }

  edit(client: Client): void {
    this.editingId.set(client.id);
    this.photoPreview.set(client.photo_url);
    this.selectedPhoto.set(null);
    this.clientForm.patchValue({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email ?? '',
      phone: client.phone,
      document_number: client.document_number ?? '',
      address: client.address ?? '',
      notes: client.notes ?? '',
    });
  }

  remove(client: Client): void {
    this.api.deleteClient(client.id).subscribe({
      next: () => {
        this.message.set(`Cliente ${client.full_name} eliminado.`);
        this.loadClients(this.pagination()?.current_page ?? 1);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudo eliminar el cliente.'));
      },
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  onSearchChange(value: string): void {
    this.search.set(value);
    this.loadClients(1);
  }

  onPhotoSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.selectedPhoto.set(file);
    this.photoPreview.set(file ? URL.createObjectURL(file) : null);
  }

  onPageChange(page: number): void {
    this.loadClients(page);
  }

  private loadClients(page = 1): void {
    this.loading.set(true);
    this.error.set('');

    this.api.getClients({ page, per_page: 8, search: this.search() }).subscribe({
      next: (response) => {
        this.clients.set(response.items);
        this.pagination.set(response.pagination);
        this.loading.set(false);
        this.saving.set(false);
      },
      error: (response: HttpErrorResponse) => {
        this.error.set(extractApiErrorMessage(response, 'No se pudieron cargar los clientes.'));
        this.loading.set(false);
        this.saving.set(false);
      },
    });
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const values = this.clientForm.getRawValue();

    appendFormDataValue(formData, 'first_name', values.first_name);
    appendFormDataValue(formData, 'last_name', values.last_name);
    appendFormDataValue(formData, 'email', values.email);
    appendFormDataValue(formData, 'phone', values.phone);
    appendFormDataValue(formData, 'document_number', values.document_number);
    appendFormDataValue(formData, 'address', values.address);
    appendFormDataValue(formData, 'notes', values.notes);

    if (this.selectedPhoto()) {
      formData.append('photo', this.selectedPhoto()!);
    }

    return formData;
  }

  private resetForm(): void {
    this.editingId.set(null);
    this.photoPreview.set(null);
    this.selectedPhoto.set(null);
    this.clientForm.reset({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      document_number: '',
      address: '',
      notes: '',
    });
    this.saving.set(false);
    this.error.set('');
  }
}
