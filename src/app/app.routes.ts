import { Routes } from '@angular/router';
import { HeroList } from './features/heroes/pages/hero-list/hero-list';
import { HeroForm } from './features/heroes/pages/hero-form/hero-form';

export const routes: Routes = [
  {
    path: '',
    component: HeroList,
  },
  {
    path: 'heroes/create',
    component: HeroForm,
  },
  {
    path: 'heroes/edit/:id',
    component: HeroForm,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
