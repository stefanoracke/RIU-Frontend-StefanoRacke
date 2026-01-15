import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeroList } from './hero-list';
import { of, throwError } from 'rxjs';
import { Hero } from '../../../../core/services/hero';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { PaginatedHeroes } from '../../interfaces/hero.interface';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { PageEvent } from '@angular/material/paginator';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

  let heroServiceSpy: jasmine.SpyObj<Hero>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  const dialogRefMock = {
    afterClosed: () => of(true),
  };

  const mockHeroService = {
    getHeroes: jasmine
      .createSpy('getHeroes')
      .and.returnValue(of({ items: [], total: 0, currentPage: 1 })),
    deleteHero: jasmine.createSpy('deleteHero').and.returnValue(of({})),
    isLoading: jasmine.createSpy('isLoading').and.returnValue(false),
  };

  const mockRouter = { navigate: jasmine.createSpy('navigate') };
  const mockSnackBar = { open: jasmine.createSpy('open') };
  const mockDialog = { open: jasmine.createSpy('open') };

  beforeEach(async () => {
    heroServiceSpy = jasmine.createSpyObj('Hero', ['getHeroes', 'deleteHero', 'isLoading']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    heroServiceSpy.getHeroes.and.returnValue(
      of({ items: [], total: 0, currentPage: 1 } as unknown as PaginatedHeroes)
    );
    heroServiceSpy.isLoading.and.returnValue(false);

    await TestBed.configureTestingModule({
      imports: [HeroList, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: Hero, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        {
          provide: MatDialog,
          useFactory: () => ({
            open: jasmine.createSpy('open').and.returnValue(dialogRefMock),
          }),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;

    component.paginator = { pageIndex: 0, length: 0 } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to create hero when addHero() is called.', () => {
    component.addHero();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/create']);
  });

  it('should navigate to edit hero when editHero() is called.', () => {
    const mockHero = { id: 1 };
    component.editHero(mockHero);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/heroes/edit', 1]);
  });

  it('should reset to page 1 when searching for a hero.', () => {
    const pageEvent = { pageIndex: 2, pageSize: 10, length: 20 } as any;
    spyOn(component.page$, 'next');
    spyOn(component.perPage$, 'next');

    component.onPageChange(pageEvent);

    expect(component.page$.next).toHaveBeenCalledWith(3);
    expect(component.perPage$.next).toHaveBeenCalledWith(10);
  });

  it('should reset to page 1 when searching for a hero.', fakeAsync(() => {
    spyOn(component.page$, 'next');
    component.searchControl.setValue('Batman');

    tick(300); // Simula el debounceTime

    expect(component.page$.next).toHaveBeenCalledWith(1);
  }));

  it('should update page$ and perPage$ when page changes', () => {
    component.onPageChange({
      pageIndex: 2,
      pageSize: 10,
      length: 100,
    } as PageEvent);

    expect(component.page$.value).toBe(3);
    expect(component.perPage$.value).toBe(10);
  });

  it('should not attempt to update the paginator if it is not defined (Branch else).', () => {
    component.paginator = undefined as any;

    const mockResponse = { items: [], total: 100, currentPage: 1 };

    mockHeroService.getHeroes.and.returnValue(of(mockResponse));

    component.heroes$.subscribe();

    expect(component.paginator).toBeUndefined();
  });
});
