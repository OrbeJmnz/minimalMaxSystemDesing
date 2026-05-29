/*
 * @minimax/ui-angular — public API
 * Componentes, directivas y servicios reutilizables del design system MiniMax.
 * Requiere @minimax/styles + Tailwind v4 en la app consumidora para los estilos.
 */

// ---- Components ----
export * from './lib/components/calendar/calendar';
export * from './lib/components/charts/chart-bar';
export * from './lib/components/charts/chart-donut';
export * from './lib/components/charts/chart-heatmap';
export * from './lib/components/charts/chart-line';
export * from './lib/components/charts/chart-ring';
export * from './lib/components/charts/chart-sparkline';
export * from './lib/components/color-picker/color-picker';
export * from './lib/components/diff-viewer/diff-viewer';
export * from './lib/components/drawer-shell/drawer-shell';
export * from './lib/components/empty-state/empty-state';
export * from './lib/components/modal-shell/modal-shell';
export * from './lib/components/otp-input/otp-input';
export * from './lib/components/pill-tabs/pill-tabs';
export * from './lib/components/pricing-toggle/pricing-toggle';
export * from './lib/components/rating-stars/rating-stars';
export * from './lib/components/rich-text-editor/rich-text-editor';
export * from './lib/components/section-header/section-header';
export * from './lib/components/skeleton/skeleton';
export * from './lib/components/toast-host/toast-host';
export * from './lib/components/tour-host/tour-host';

// ---- Directives ----
export * from './lib/directives/click-outside.directive';
export * from './lib/directives/ripple.directive';
export * from './lib/directives/tooltip.directive';

// ---- Services ----
export * from './lib/services/mobile-nav.service';
export * from './lib/services/overlay.service';
export * from './lib/services/theme.service';
export * from './lib/services/toast.service';
export * from './lib/services/tour.service';
