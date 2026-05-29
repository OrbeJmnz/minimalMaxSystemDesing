import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'overview' },
  {
    path: 'overview',
    loadComponent: () => import('./features/overview/overview').then((m) => m.OverviewComponent),
    title: 'Overview · MinimalMax Components',
  },
  {
    path: 'prompt-lab',
    loadComponent: () =>
      import('./features/prompt-lab/prompt-lab').then((m) => m.PromptLabComponent),
    title: 'AI Prompt Lab · MinimalMax Components',
  },
  {
    path: 'markdown',
    loadComponent: () =>
      import('./features/markdown/markdown').then((m) => m.MarkdownFeatureComponent),
    title: 'Markdown Editor · MinimalMax Components',
  },
  {
    path: 'inbox',
    loadComponent: () => import('./features/inbox/inbox').then((m) => m.InboxComponent),
    title: 'Inbox · MinimalMax Components',
  },
  {
    path: 'search',
    loadComponent: () => import('./features/search/search').then((m) => m.SearchComponent),
    title: 'Search · MinimalMax Components',
  },
  {
    path: 'date-range',
    loadComponent: () =>
      import('./features/date-range/date-range').then((m) => m.DateRangeComponent),
    title: 'Date Range Picker · MinimalMax Components',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.DashboardComponent),
    title: 'Analytics Dashboard · MinimalMax Components',
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings').then((m) => m.SettingsComponent),
    title: 'Settings · MinimalMax Components',
  },
  {
    path: 'onboarding',
    loadComponent: () =>
      import('./features/onboarding/onboarding').then((m) => m.OnboardingComponent),
    title: 'Onboarding · MinimalMax Components',
  },
  {
    path: 'comments',
    loadComponent: () => import('./features/comments/comments').then((m) => m.CommentsComponent),
    title: 'Comments · MinimalMax Components',
  },
  {
    path: 'diff',
    loadComponent: () => import('./features/diff/diff').then((m) => m.DiffComponent),
    title: 'Diff Viewer · MinimalMax Components',
  },
  {
    path: 'marketing',
    loadComponent: () => import('./features/marketing/marketing').then((m) => m.MarketingComponent),
    title: 'Marketing Patterns · MinimalMax Components',
  },
  {
    path: 'empty-illustrated',
    loadComponent: () =>
      import('./features/empty-illustrated/empty-illustrated').then(
        (m) => m.EmptyIllustratedComponent,
      ),
    title: 'Empty States ilustrativos · MinimalMax Components',
  },
  {
    path: 'buttons',
    loadComponent: () => import('./features/buttons/buttons').then((m) => m.ButtonsComponent),
    title: 'Buttons · MinimalMax Components',
  },
  {
    path: 'inputs',
    loadComponent: () => import('./features/inputs/inputs').then((m) => m.InputsComponent),
    title: 'Inputs · MinimalMax Components',
  },
  {
    path: 'cards',
    loadComponent: () => import('./features/cards/cards').then((m) => m.CardsComponent),
    title: 'Cards · MinimalMax Components',
  },
  {
    path: 'forms',
    loadComponent: () => import('./features/forms/forms').then((m) => m.FormsComponent),
    title: 'Forms · MinimalMax Components',
  },
  {
    path: 'forms-advanced',
    loadComponent: () =>
      import('./features/forms-advanced/forms-advanced').then((m) => m.FormsAdvancedComponent),
    title: 'Forms avanzados · MinimalMax Components',
  },
  {
    path: 'navigation',
    loadComponent: () =>
      import('./features/navigation/navigation').then((m) => m.NavigationComponent),
    title: 'Navigation · MinimalMax Components',
  },
  {
    path: 'badges',
    loadComponent: () => import('./features/badges/badges').then((m) => m.BadgesComponent),
    title: 'Badges · MinimalMax Components',
  },
  {
    path: 'data-display',
    loadComponent: () =>
      import('./features/data-display/data-display').then((m) => m.DataDisplayComponent),
    title: 'Data · MinimalMax Components',
  },
  {
    path: 'charts',
    loadComponent: () => import('./features/charts/charts').then((m) => m.ChartsComponent),
    title: 'Charts · MinimalMax Components',
  },
  {
    path: 'code-display',
    loadComponent: () =>
      import('./features/code-display/code-display').then((m) => m.CodeDisplayComponent),
    title: 'Code display · MinimalMax Components',
  },
  {
    path: 'inputs-pro',
    loadComponent: () =>
      import('./features/inputs-pro/inputs-pro').then((m) => m.InputsProComponent),
    title: 'Inputs Pro · MinimalMax Components',
  },
  {
    path: 'calendar',
    loadComponent: () =>
      import('./features/calendar/calendar').then((m) => m.CalendarFeatureComponent),
    title: 'Calendar · MinimalMax Components',
  },
  {
    path: 'kanban',
    loadComponent: () => import('./features/kanban/kanban').then((m) => m.KanbanComponent),
    title: 'Kanban · MinimalMax Components',
  },
  {
    path: 'chat',
    loadComponent: () => import('./features/chat/chat').then((m) => m.ChatComponent),
    title: 'Chat · MinimalMax Components',
  },
  {
    path: 'social',
    loadComponent: () => import('./features/social/social').then((m) => m.SocialComponent),
    title: 'Social feed · MinimalMax Components',
  },
  {
    path: 'tour',
    loadComponent: () => import('./features/tour/tour').then((m) => m.TourComponent),
    title: 'Tour · MinimalMax Components',
  },
  {
    path: 'overlays',
    loadComponent: () => import('./features/overlays/overlays').then((m) => m.OverlaysComponent),
    title: 'Overlays · MinimalMax Components',
  },
  {
    path: 'dropdown',
    loadComponent: () => import('./features/dropdown/dropdown').then((m) => m.DropdownComponent),
    title: 'Dropdown · MinimalMax Components',
  },
  {
    path: 'multimedia',
    loadComponent: () =>
      import('./features/multimedia/multimedia').then((m) => m.MultimediaComponent),
    title: 'Multimedia · MinimalMax Components',
  },
  {
    path: 'exports',
    loadComponent: () => import('./features/exports/exports').then((m) => m.ExportsComponent),
    title: 'Exports · MinimalMax Components',
  },
  {
    path: 'maps',
    loadComponent: () => import('./features/maps/maps').then((m) => m.MapsComponent),
    title: 'Maps · MinimalMax Components',
  },
  {
    path: 'layouts',
    loadComponent: () => import('./features/layouts/layouts').then((m) => m.LayoutsComponent),
    title: 'Layouts · MinimalMax Components',
  },
  {
    path: 'payments',
    loadComponent: () => import('./features/payments/payments').then((m) => m.PaymentsComponent),
    title: 'Payments · MinimalMax Components',
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth').then((m) => m.AuthComponent),
    title: 'Auth · MinimalMax Components',
  },
  {
    path: 'states',
    loadComponent: () => import('./features/states/states').then((m) => m.StatesComponent),
    title: 'Estados · MinimalMax Components',
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found').then((m) => m.NotFoundComponent),
    title: '404 · MinimalMax Components',
  },
];
