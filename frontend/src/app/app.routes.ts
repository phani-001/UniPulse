import { Routes } from '@angular/router';
import { authGuard, publicGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './shared/components/layout/main-layout.component';

export const routes: Routes = [
  // Public auth routes
  {
    path: 'auth/login',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    canActivate: [publicGuard],
    loadComponent: () => import('./features/auth/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'auth/change-password',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/change-password.component').then(m => m.ChangePasswordComponent)
  },

  // Protected portal routes wrapped in MainLayout
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'clubs',
        loadComponent: () => import('./features/clubs/club-list.component').then(m => m.ClubListComponent)
      },
      {
        path: 'clubs/:id',
        loadComponent: () => import('./features/clubs/club-detail.component').then(m => m.ClubDetailComponent)
      },
      {
        path: 'events',
        loadComponent: () => import('./features/events/event-list.component').then(m => m.EventListComponent)
      },
      {
        path: 'events/:id',
        loadComponent: () => import('./features/events/event-detail.component').then(m => m.EventDetailComponent)
      },
      {
        path: 'results',
        loadComponent: () => import('./features/results/result-list.component').then(m => m.ResultListComponent)
      },
      {
        path: 'network',
        loadComponent: () => import('./features/network/network.component').then(m => m.NetworkComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./features/chat/chat.component').then(m => m.ChatComponent)
      },
      {
        path: 'mvgr-hub',
        loadComponent: () => import('./features/mvgr-hub/mvgr-hub.component').then(m => m.MvgrHubComponent)
      },
      {
        path: 'db-inspector',
        loadComponent: () => import('./features/db-inspector/db-inspector.component').then(m => m.DbInspectorComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },

  // Fallback
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
