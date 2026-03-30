import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PaginationMeta } from '../../models/types';
import { PaginationComponent } from '../pagination/pagination.component';

export interface SelectorColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'app-entity-selector-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './entity-selector-modal.component.html',
  styleUrl: './entity-selector-modal.component.scss',
})
export class EntitySelectorModalComponent {
  readonly open = input(false);
  readonly title = input('Seleccionar');
  readonly subtitle = input('');
  readonly items = input<any[]>([]);
  readonly columns = input<SelectorColumn[]>([]);
  readonly pagination = input<PaginationMeta | null>(null);
  readonly loading = input(false);
  readonly search = input('');
  readonly imageKey = input<string | null>(null);

  readonly close = output<void>();
  readonly searchChange = output<string>();
  readonly pageChange = output<number>();
  readonly select = output<any>();

  onSearch(value: string): void {
    this.searchChange.emit(value);
  }

  pick(item: any): void {
    this.select.emit(item);
  }

  resolveValue(item: any, key: string): string {
    return key.split('.').reduce((current, part) => current?.[part], item) ?? 'N/D';
  }
}
