import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Hero } from '../../../../core/services/hero';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Uppercase } from '../../../../shared/uppercase';

@Component({
  selector: 'app-hero-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    Uppercase,
  ],
  templateUrl: './hero-form.html',
  styleUrl: './hero-form.scss',
})
export class HeroForm implements OnInit, OnDestroy {
  heroService = inject(Hero);
  route = inject(ActivatedRoute);
  router = inject(Router);
  fb = inject(FormBuilder);
  snackBar = inject(MatSnackBar);

  destroy$ = new Subject<void>();
  heroForm: FormGroup;
  isEdit = false;
  heroId: number | null = null;

  constructor() {
    this.heroForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      power: ['', [Validators.required]],
      alterEgo: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEdit = true;
      this.heroId = +id;
      this.heroService
        .getHeroById(this.heroId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((hero) => {
          if (hero) {
            this.heroForm.patchValue(hero);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  save() {
    if (this.heroForm.valid) {
      const heroData = this.heroForm.value;
      const observable = this.isEdit
        ? this.heroService.updateHero(this.heroId!, heroData)
        : this.heroService.createHero(heroData);

      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          const message = this.isEdit ? 'Héroe editado exitosamente' : 'Héroe creado exitosamente';
          this.snackBar.open(message, 'Cerrar', { duration: 3000 });
          this.router.navigate(['/']);
        },
        error: () => {
          this.snackBar.open('Error al guardar el héroe', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }
}
