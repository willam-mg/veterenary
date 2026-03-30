import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Appointment } from '../../models/types';
import { DemoApiService } from '../../services/demo-api.service';

@Component({
  selector: 'app-appointments-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './appointments-page.component.html',
  styleUrl: './appointments-page.component.scss',
})
export class AppointmentsPageComponent implements OnInit {
  private readonly api = inject(DemoApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly appointments = signal<Appointment[]>([]);

  readonly appointmentForm = this.formBuilder.nonNullable.group({
    petName: ['', [Validators.required, Validators.minLength(2)]],
    ownerName: ['', [Validators.required, Validators.minLength(2)]],
    date: ['2026-03-25T09:30', [Validators.required]],
    reason: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.api.getAppointments().subscribe({
      next: (appointments) => {
        this.appointments.set(appointments);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar citas demo.');
        this.loading.set(false);
      },
    });
  }

  submit(): void {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    const nextId = Math.max(...this.appointments().map((appointment) => appointment.id), 0) + 1;
    const newAppointment: Appointment = {
      id: nextId,
      petName: this.appointmentForm.controls.petName.value,
      ownerName: this.appointmentForm.controls.ownerName.value,
      date: this.appointmentForm.controls.date.value,
      reason: this.appointmentForm.controls.reason.value,
      status: 'pending',
    };

    this.appointments.update((appointments) => [newAppointment, ...appointments]);
    this.appointmentForm.patchValue({
      petName: '',
      ownerName: '',
      date: '2026-03-25T09:30',
      reason: '',
    });
    this.appointmentForm.markAsPristine();
  }
}
