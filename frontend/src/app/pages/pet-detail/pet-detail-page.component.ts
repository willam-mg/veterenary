import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { PetStoreService } from '../../services/pet-store.service';

@Component({
  selector: 'app-pet-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pet-detail-page.component.html',
  styleUrl: './pet-detail-page.component.scss',
})
export class PetDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly petStore = inject(PetStoreService);

  readonly pet = computed(() => {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    return Number.isFinite(id) ? this.petStore.getById(id) : undefined;
  });
}
