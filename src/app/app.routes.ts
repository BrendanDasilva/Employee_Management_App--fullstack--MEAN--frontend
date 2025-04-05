import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { authGuard } from './guards/auth.guard';

// Define all application routes
export const routes: Routes = [
  // Default route: redirect to login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login and signup routes (public)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Main employee list view (protected by auth guard)
  {
    path: 'employees',
    component: EmployeeListComponent,
    canActivate: [authGuard], // Only accessible if logged in
  },

  // Add new employee route (lazy loaded, protected)
  {
    path: 'employees/add',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-add/employee-add.component').then(
        (m) => m.EmployeeAddComponent
      ),
  },

  // View employee details route (lazy loaded, protected)
  {
    path: 'employees/view/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-view/employee-view.component').then(
        (m) => m.EmployeeViewComponent
      ),
    renderMode: 'default' as any, // Fix for standalone components
  } as any,

  // Edit employee route (lazy loaded, protected)
  {
    path: 'employees/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./components/employee-edit/employee-edit.component').then(
        (m) => m.EmployeeEditComponent
      ),
    renderMode: 'default' as any, // Workaround type issue
  } as any,

  // Wildcard route for non-matching paths (404 page)
  {
    path: '**',
    loadComponent: () =>
      import('./components/page-not-found/page-not-found.component').then(
        (m) => m.PageNotFoundComponent
      ),
  },
];
