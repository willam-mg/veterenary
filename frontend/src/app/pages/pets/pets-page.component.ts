import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Owner } from '../../models/types';
import { DemoApiService } from '../../services/demo-api.service';
import { PetStoreService } from '../../services/pet-store.service';

@Component({
  selector: 'app-pets-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pets-page.component.html',
  styleUrl: './pets-page.component.scss',
})
export class PetsPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly api = inject(DemoApiService);
  private readonly petStore = inject(PetStoreService);

  readonly owners = signal<Owner[]>([]);
  readonly loadingOwners = signal(false);
  readonly saving = signal(false);
  readonly message = signal('');

  readonly pets = this.petStore.pets;

  readonly petForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    species: this.formBuilder.nonNullable.control<'Dog' | 'Cat' | 'Other'>('Dog'),
    age: [1, [Validators.required, Validators.min(0), Validators.max(30)]],
    ownerId: [1, [Validators.required]],
    vaccineDueDate: ['2026-04-20', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadingOwners.set(true);
    this.api.getOwners().subscribe({
      next: (owners) => {
        this.owners.set(owners);
        const firstOwnerId = owners[0]?.id ?? 1;
        this.petForm.patchValue({ ownerId: firstOwnerId });
        this.loadingOwners.set(false);
      },
      error: () => {
        this.message.set('No se pudieron cargar clientes desde la API demo.');
        this.loadingOwners.set(false);
      },
    });
  }

  submit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    const owner = this.owners().find((candidate) => candidate.id === this.petForm.value.ownerId);
    if (!owner) {
      this.message.set('Debes seleccionar un cliente valido.');
      return;
    }

    this.saving.set(true);
    this.api.getPetPhoto().subscribe((photoUrl) => {
      this.petStore.addPet({
        name: this.petForm.controls.name.value,
        species: this.petForm.controls.species.value,
        age: Number(this.petForm.controls.age.value),
        ownerId: owner.id,
        ownerName: owner.name,
        imageUrl: photoUrl,
        vaccineDueDate: this.petForm.controls.vaccineDueDate.value,
      });

      this.petForm.patchValue({ name: '', age: 1, species: 'Dog', vaccineDueDate: '2026-04-20' });
      this.petForm.markAsPristine();
      this.message.set('Mascota creada correctamente.');
      this.saving.set(false);
    });
  }

  controlHasError(controlName: 'name' | 'age' | 'ownerId' | 'vaccineDueDate'): boolean {
    const control = this.petForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }
}
