import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';

import { Owner } from '../../models/types';
import { DemoApiService } from '../../services/demo-api.service';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.scss',
})
export class ClientsPageComponent implements OnInit {
  private readonly api = inject(DemoApiService);

  readonly loading = signal(true);
  readonly error = signal('');
  readonly owners = signal<Owner[]>([]);

  ngOnInit(): void {
    this.api.getOwners().subscribe({
      next: (owners) => {
        this.owners.set(owners);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar clientes desde API demo.');
        this.loading.set(false);
      },
    });
  }
}
