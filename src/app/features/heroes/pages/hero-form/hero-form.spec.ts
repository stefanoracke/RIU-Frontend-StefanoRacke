import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { HeroForm } from './hero-form';
import { Hero } from '../../../../core/services/hero';
import { Uppercase } from '../../../../shared/uppercase';

// Stub para ActivatedRoute
class ActivatedRouteStub {
  snapshot = {
    params: {},
  };
}

describe('HeroForm', () => {
  let component: HeroForm;
  let fixture: ComponentFixture<HeroForm>;
  let heroServiceSpy: jasmine.SpyObj<Hero>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(async () => {
    const heroSpy = jasmine.createSpyObj('Hero', [
      'getHeroById',
      'createHero',
      'updateHero',
      'isLoading',
    ]);
    heroSpy.isLoading.and.returnValue(false);

    const routerMock = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    activatedRouteStub = new ActivatedRouteStub();

    await TestBed.configureTestingModule({
      imports: [
        HeroForm,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        Uppercase,
      ],
      providers: [
        FormBuilder,
        { provide: Hero, useValue: heroSpy },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
      ],
    })
      .overrideComponent(HeroForm, {
        remove: {
          imports: [MatSnackBarModule],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HeroForm);
    component = fixture.componentInstance;

    heroServiceSpy = TestBed.inject(Hero) as jasmine.SpyObj<Hero>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form correctly', () => {
    fixture.detectChanges();

    expect(component.heroForm).toBeDefined();
    expect(component.heroForm.get('name')).toBeDefined();
    expect(component.heroForm.get('power')).toBeDefined();
    expect(component.heroForm.get('alterEgo')).toBeDefined();
  });

  it('should set isEdit to false when no id in route', () => {
    activatedRouteStub.snapshot.params = {};
    fixture.detectChanges();

    expect(component.isEdit).toBeFalse();
  });

  it('should load hero and set form in edit mode', fakeAsync(() => {
    const mockHero = {
      id: 1,
      name: 'SUPERMAN',
      power: 'Volar',
      alterEgo: 'Clark Kent',
    };

    activatedRouteStub.snapshot.params = { id: '1' };
    heroServiceSpy.getHeroById.and.returnValue(of(mockHero));

    fixture.detectChanges();
    tick();

    expect(component.isEdit).toBeTrue();
    expect(component.heroId).toBe(1);
    expect(component.heroForm.value).toEqual({
      name: 'SUPERMAN',
      power: 'Volar',
      alterEgo: 'Clark Kent',
    });
  }));
  it('should save hero in create mode', fakeAsync(() => {
    fixture.detectChanges();

    const newHero = {
      name: 'BATMAN',
      power: 'Inteligencia',
      alterEgo: 'Bruce Wayne',
    };

    component.heroForm.setValue(newHero);
    heroServiceSpy.createHero.and.returnValue(of({ id: 1, ...newHero }));

    component.save();
    tick();

    expect(heroServiceSpy.createHero).toHaveBeenCalledWith(newHero);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Héroe creado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should save hero in edit mode', fakeAsync(() => {
    fixture.detectChanges();

    component.isEdit = true;
    component.heroId = 1;

    const updatedHero = {
      name: 'SUPERMAN',
      power: 'Superfuerza',
      alterEgo: 'Clark Kent',
    };

    component.heroForm.setValue(updatedHero);
    heroServiceSpy.updateHero.and.returnValue(of({ id: 1, ...updatedHero }));

    component.save();
    tick();

    expect(heroServiceSpy.updateHero).toHaveBeenCalledWith(1, updatedHero);
    expect(snackBarSpy.open).toHaveBeenCalledWith('Héroe editado exitosamente', 'Cerrar', {
      duration: 3000,
    });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  }));

  it('should show error snackbar on save failure', fakeAsync(() => {
    fixture.detectChanges();

    component.heroForm.setValue({
      name: 'TEST',
      power: 'Test',
      alterEgo: 'Test',
    });

    heroServiceSpy.createHero.and.returnValue(throwError(() => new Error('Error')));

    component.save();
    tick();

    expect(snackBarSpy.open).toHaveBeenCalledWith('Error al guardar el héroe', 'Cerrar', {
      duration: 3000,
    });
  }));

  it('should not save if form is invalid', () => {
    fixture.detectChanges();

    component.heroForm.setValue({
      name: '',
      power: '',
      alterEgo: '',
    });

    component.save();

    expect(heroServiceSpy.createHero).not.toHaveBeenCalled();
  });
});
