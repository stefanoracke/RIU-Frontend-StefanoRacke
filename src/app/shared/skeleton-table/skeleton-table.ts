import { Component, Input, OnChanges } from '@angular/core';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-skeleton-table',
  imports: [MatTableModule],
  standalone: true,
  templateUrl: './skeleton-table.html',
  styleUrl: './skeleton-table.scss',
})
export class SkeletonTable implements OnChanges {
  @Input() columns: number = 4;
  @Input() rows: number = 4;
  displayedColumns: string[] = [];
  skeletonData: unknown[] = [];
  ngOnChanges() {
    this.displayedColumns = Array.from({ length: this.columns }, (_, i) => `col${i + 1}`);

    this.skeletonData = Array.from({ length: this.rows });
  }
}
