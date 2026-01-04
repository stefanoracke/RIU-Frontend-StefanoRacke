import { Component, inject } from '@angular/core';
import { Hero } from '../../../../core/services/hero';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatPaginatorIntlSpanish } from '../../../../shared/MatPaginatorIntlSpanish';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-hero-list',
  imports: [AsyncPipe, MatPaginatorModule, MatTableModule],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlSpanish }],
  templateUrl: './hero-list.html',
  styleUrl: './hero-list.scss',
})
export class HeroList {
  heroService = inject(Hero);
  heroes$ = this.heroService.getHeroes(1, 8);
  displayedColumns: string[] = ['name', 'power', 'alterEgo'];

  ngOnInit() {
    // Aquí podrías llamar a heroService.getHeroes() para obtener y mostrar la lista de héroes
  }
}
