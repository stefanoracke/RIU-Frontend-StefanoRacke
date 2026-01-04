import { Injectable, signal } from '@angular/core';
import { IHero, PaginatedHeroes } from '../../features/heroes/interfaces/hero.interface';
import { HEROES_MOCK } from '../mocks/heroes';
import { delay, map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Hero {
  // Estado principal: lista completa de héroes
  private heroesSignal = signal<IHero[]>([...HEROES_MOCK]);
  private readonly SIMULATED_LATENCY = 1000;

  constructor() {}

  /**
   * @param page Numero de página.
   * @param perPage Items por página.
   * @param query Filtro de búsqueda por nombre (opcional).
   * @returns Observable con héroes paginados y filtrados.
   */
  getHeroes(page: number, perPage: number, query: string = ''): Observable<PaginatedHeroes> {
    const allHeroes = this.heroesSignal();

    const filteredHeroes = allHeroes.filter((hero) =>
      hero.name.toLowerCase().includes(query.toLowerCase())
    );

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedItems = filteredHeroes.slice(start, end);

    const result: PaginatedHeroes = {
      items: paginatedItems,
      total: filteredHeroes.length,
      totalPages: Math.ceil(filteredHeroes.length / perPage),
      currentPage: page,
    };

    return of(result).pipe(delay(this.SIMULATED_LATENCY));
  }

  /**
   * Obtiene un héroe por su ID.
   */
  getHeroById(id: number): Observable<IHero | undefined> {
    const hero = this.heroesSignal().find((h) => h.id === id);
    return of(hero).pipe(delay(this.SIMULATED_LATENCY));
  }

  /**
   * Crea un nuevo héroe.
   */
  createHero(hero: Omit<IHero, 'id'>): Observable<IHero> {
    const currentHeroes = this.heroesSignal();
    const newId = currentHeroes.length > 0 ? Math.max(...currentHeroes.map((h) => h.id)) + 1 : 1;
    const newHero = { ...hero, id: newId };

    return of(newHero).pipe(
      delay(this.SIMULATED_LATENCY),
      tap((createdHero) => {
        this.heroesSignal.update((heroes) => [...heroes, createdHero]);
      })
    );
  }

  /**
   * Edita un héroe existente.
   */
  updateHero(id: number, changes: Partial<Hero>): Observable<IHero | undefined> {
    return of(null).pipe(
      delay(this.SIMULATED_LATENCY),
      map(() => {
        let updatedHero: IHero | undefined;
        this.heroesSignal.update((heroes) =>
          heroes.map((h) => {
            if (h.id === id) {
              updatedHero = { ...h, ...changes };
              return updatedHero;
            }
            return h;
          })
        );
        return updatedHero;
      })
    );
  }

  /**
   * Elimina un heroe.
   */
  deleteHero(id: number): Observable<boolean> {
    return of(true).pipe(
      delay(this.SIMULATED_LATENCY),
      tap(() => {
        this.heroesSignal.update((heroes) => heroes.filter((h) => h.id !== id));
      })
    );
  }
}
