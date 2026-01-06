import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { Hero } from './hero';
import { HEROES_MOCK } from '../mocks/heroes';

describe('Hero', () => {
  let service: Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Hero);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return paginated heroes', async () => {
    const result = await firstValueFrom(service.getHeroes(1, 10));
    expect(result.items.length).toBe(10);
    expect(result.total).toBe(HEROES_MOCK.length);
    expect(result.currentPage).toBe(1);
  });

  it('should filter heroes by query', async () => {
    const query = 'Spider';
    const result = await firstValueFrom(service.getHeroes(1, 10, query));
    expect(result.items.every(hero => hero.name.toLowerCase().includes(query.toLowerCase()))).toBe(true);
  });

  it('should get hero by id', async () => {
    const heroId = 1;
    const result = await firstValueFrom(service.getHeroById(heroId));
    expect(result?.id).toBe(heroId);
  });

  it('should return undefined for non-existent hero', async () => {
    const result = await firstValueFrom(service.getHeroById(999));
    expect(result).toBeUndefined();
  });

  it('should create a new hero', async () => {
    const newHero = { name: 'New Hero', power: 'Super Strength', description: 'A new hero' };
    const result = await firstValueFrom(service.createHero(newHero));
    expect(result.name).toBe(newHero.name);
    expect(result.id).toBeDefined();
  });

  it('should update an existing hero', async () => {
    const heroId = 1;
    const changes = { name: 'Updated Hero' };
    const result = await firstValueFrom(service.updateHero(heroId, changes));
    expect(result?.name).toBe(changes.name);
  });

  it('should return undefined when updating non-existent hero', async () => {
    const result = await firstValueFrom(service.updateHero(999, { name: 'Test' }));
    expect(result).toBeUndefined();
  });

  it('should delete a hero', async () => {
    const heroId = 1;
    const result = await firstValueFrom(service.deleteHero(heroId));
    expect(result).toBe(true);
    const hero = await firstValueFrom(service.getHeroById(heroId));
    expect(hero).toBeUndefined();
  });
});
