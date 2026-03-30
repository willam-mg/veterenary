import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import { PaginationMeta } from '../../models/types';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  readonly pagination = input<PaginationMeta | null>(null);
  readonly pageChange = output<number>();

  previous(): void {
    const pagination = this.pagination();
    if (pagination && pagination.current_page > 1) {
      this.pageChange.emit(pagination.current_page - 1);
    }
  }

  next(): void {
    const pagination = this.pagination();
    if (pagination && pagination.current_page < pagination.last_page) {
      this.pageChange.emit(pagination.current_page + 1);
    }
  }
}
