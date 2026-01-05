import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { Hero } from '../../../../core/services/hero';
import { AsyncPipe } from '@angular/common';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
  MatPaginator,
  PageEvent,
} from '@angular/material/paginator';
import { MatPaginatorIntlSpanish } from '../../../../shared/MatPaginatorIntlSpanish';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, debounceTime, startWith, switchMap, tap } from 'rxjs';
import { SkeletonTable } from '../../../../shared/skeleton-table/skeleton-table';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-hero-list',
  imports: [
    AsyncPipe,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    SkeletonTable,
    ReactiveFormsModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpanish }],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
})
export class HeroList implements AfterViewInit {
  heroService = inject(Hero);
  router = inject(Router);
  snackBar = inject(MatSnackBar);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchControl = new FormControl('');
  page$ = new BehaviorSubject<number>(1);
  perPage$ = new BehaviorSubject<number>(8);
  query$ = this.searchControl.valueChanges.pipe(
    debounceTime(300),
    startWith(''),
    tap(() => this.page$.next(1))
  );

  heroes$ = combineLatest([this.page$, this.perPage$, this.query$]).pipe(
    switchMap(([page, perPage, query]) => this.heroService.getHeroes(page, perPage, query || '')),
    tap((response) => {
      if (this.paginator) {
        this.paginator.pageIndex = response.currentPage - 1;
        this.paginator.length = response.total;
      }
    })
  );

  displayedColumns: string[] = ['name', 'power', 'alterEgo', 'actions'];

  ngAfterViewInit() {
    // Inicializar el paginator
  }

  editHero(hero: any) {
    this.router.navigate(['/heroes/edit', hero.id]);
  }

  deleteHero(id: number) {
    this.heroService.deleteHero(id).subscribe({
      next: () => {
        this.snackBar.open('Héroe eliminado exitosamente', 'Cerrar', { duration: 3000 });
        // Refrescar la lista
        this.page$.next(1);
      },
      error: () => {
        this.snackBar.open('Error al eliminar el héroe', 'Cerrar', { duration: 3000 });
      },
    });
  }

  onPageChange(event: PageEvent) {
    this.page$.next(event.pageIndex + 1);
    this.perPage$.next(event.pageSize);
  }

  addHero() {
    this.router.navigate(['/heroes/create']);
  }
}
