import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { HeroList } from './hero-list';
import { of, throwError } from 'rxjs';
import { Hero } from '../../../../core/services/hero';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

describe('HeroList', () => {
  let component: HeroList;
  let fixture: ComponentFixture<HeroList>;

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
    await TestBed.configureTestingModule({
      imports: [HeroList, ReactiveFormsModule],
      providers: [
        { provide: Hero, useValue: mockHeroService },
        { provide: Router, useValue: mockRouter },
        { provide: MatSnackBar, useValue: mockSnackBar },
        { provide: MatDialog, useValue: mockDialog },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroList);
    component = fixture.componentInstance;
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

  it('should remove the hero if the user confirms in the dialogue.', () => {
    mockDialog.open.and.returnValue({
      afterClosed: () => of(true),
    });

    component.deleteHero(1);

    expect(mockHeroService.deleteHero).toHaveBeenCalledWith(1);
    expect(mockSnackBar.open).toHaveBeenCalledWith('Héroe eliminado exitosamente', 'Cerrar', {
      duration: 3000,
    });
  });

  it('it should display an error if the deletion fails.', () => {
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) });
    mockHeroService.deleteHero.and.returnValue(throwError(() => new Error('Error')));

    component.deleteHero(1);

    expect(mockSnackBar.open).toHaveBeenCalledWith('Error al eliminar el héroe', 'Cerrar', {
      duration: 3000,
    });
  });

  it('should not attempt to update the paginator if it is not defined (Branch else).', () => {
    component.paginator = undefined as any;

    const mockResponse = { items: [], total: 100, currentPage: 1 };

    mockHeroService.getHeroes.and.returnValue(of(mockResponse));

    component.heroes$.subscribe();

    expect(component.paginator).toBeUndefined();
  });
});
