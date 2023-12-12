import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConnexionService } from '../../services/connexion/connexion.service';

export type PaginationType = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
};

@Component({
  selector: 'core-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
  standalone: true,
})
export class PaginationComponent {
  @Input({ required: true }) pagination!: PaginationType;

  @Output() pageChange = new EventEmitter<number>();

  constructor(private connexionService: ConnexionService) {}

  get isOnline() {
    return this.connexionService.isUserOnline();
  }

  get firstNumber(): number {
    if (this.pagination.totalItems === 0) {
      return 0;
    }

    if (this.pagination.currentPage === 1) {
      return 1;
    }
    return (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
  }

  get endNumber(): number {
    const endNumber =
      this.pagination.currentPage * this.pagination.itemsPerPage;
    return endNumber <= this.pagination.totalItems
      ? endNumber
      : this.pagination.totalItems;
  }

  public goToPage(direction: number): void {
    if (
      (direction > 0 &&
        this.pagination.currentPage * this.pagination.itemsPerPage <
          this.pagination.totalItems) ||
      (direction < 0 && this.pagination.currentPage !== 1)
    ) {
      this.pagination.currentPage = this.pagination.currentPage + direction;
      this.pageChange.emit();
    }
  }
}
