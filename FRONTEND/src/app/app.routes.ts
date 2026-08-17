import { Routes } from '@angular/router';
import { authChildGuard } from './pages/auth-pages/services/auth.guard';

const childrenRoutes: Routes = [
  {
    path: 'comparador-frutas',
    loadComponent: () => import('./pages/fruit-comparison/components/fruit-comparison/fruit-comparison.component').then((m) => m.FruitComparisonComponent),
  },
  {
    path: 'calculadora-preparacion',
    loadComponent: () => import('./pages/preparation-calculator/components/preparation-calculator/preparation-calculator.component').then((m) => m.PreparationCalculatorComponent),
  },
  {
    path: 'perfil-sensorial',
    loadComponent: () => import('./pages/sensory-profile/components/sensory-profile/sensory-profile.component').then((m) => m.SensoryProfileComponent),
  },
  {
    path: 'mapa-bioactivo',
    loadComponent: () => import('./pages/bioactive-map/components/bioactive-map/bioactive-map.component').then((m) => m.BioactiveMapComponent),
  },
  {
    path: 'condiciones/:id',
    loadComponent: () => import('./pages/condition/components/condition-results/condition-results.component').then((m) => m.ConditionResultsComponent),
  },
  {
    path: 'condiciones',
    loadComponent: () => import('./pages/condition/components/condition/condition.component').then((m) => m.Condition)
  },
  {
    path: 'infusiones-funcionales',
    loadComponent: () => import('./pages/functional-infusions/components/functional-infusions/functional-infusions.component').then((m) => m.FunctionalInfusionsComponent),
  },
  {
    path: 'educacion',
    loadComponent: () => import('./pages/consumer-education/components/consumer-education/consumer-education.component').then((m) => m.ConsumerEducationComponent),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/profile/components/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'creacion-mixes',
    loadComponent: () => import('./pages/mix-creation/components/mix-creation/mix-creation.component').then((m) => m.MixCreationComponent),
  },
  {
    path: 'referencias-bibliograficas',
    loadComponent: () => import('./pages/references/components/references/references.component').then((m) => m.ReferencesComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/other-page/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/components/home/home.component').then((m) => m.HomeComponent),
    pathMatch: 'full',
  },

  /*
  {
    path: 'fruit',
    loadComponent: () => import('./pages/fruit/fruit.component').then((m) => m.FruitComponent),
  },
  */
  {
    path: 'signin',
    loadComponent: () => import('./pages/auth-pages/components/sign-in/sign-in.component').then((m) => m.SignInComponent),
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth-pages/components/sign-up/sign-up.component').then((m) => m.SignUpComponent),
  },
  {
    path: '',
    loadComponent: () => import('./layout/app-layout.component').then((m) => m.AppLayoutComponent),
    children: childrenRoutes,
    canActivateChild: [authChildGuard],
  },
];
