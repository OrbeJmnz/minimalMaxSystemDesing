import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ModalShellComponent } from '../../shared/components/modal-shell/modal-shell';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ToastService } from '../../core/services/toast.service';

interface SettingsSection {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly description: string;
}

interface Integration {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly icon: string;
  readonly tone: string;
  connected: boolean;
}

interface TeamMember {
  readonly name: string;
  readonly email: string;
  readonly initials: string;
  readonly tone: string;
  readonly role: 'admin' | 'editor' | 'viewer';
}

@Component({
  selector: 'mm-settings',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    ModalShellComponent,
    RippleDirective,
  ],
  templateUrl: './settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SettingsComponent {
  private readonly toast = inject(ToastService);

  protected readonly sections: readonly SettingsSection[] = [
    {
      id: 'account',
      label: 'Cuenta',
      icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      description: 'Tu perfil público y datos personales',
    },
    {
      id: 'security',
      label: 'Seguridad',
      icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      description: 'Contraseña, 2FA y sesiones activas',
    },
    {
      id: 'billing',
      label: 'Facturación',
      icon: 'M3 10h18M5 6h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z',
      description: 'Plan, método de pago e historial',
    },
    {
      id: 'integrations',
      label: 'Integraciones',
      icon: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
      description: 'Servicios conectados (GitHub, Slack, Notion…)',
    },
    {
      id: 'notifications',
      label: 'Notificaciones',
      icon: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0',
      description: 'Email, push y digest semanal',
    },
    {
      id: 'team',
      label: 'Equipo',
      icon: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
      description: 'Miembros y permisos del workspace',
    },
    {
      id: 'danger',
      label: 'Danger zone',
      icon: 'M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z',
      description: 'Eliminar cuenta o exportar datos',
    },
  ];

  protected readonly activeSection = signal<string>('account');

  protected readonly nameInput = signal('Orbelin Jimenez');
  protected readonly handleInput = signal('orbe');
  protected readonly emailInput = signal('orbe@minimalmax.com');
  protected readonly bioInput = signal(
    'Mexican dev · forging premium components con Viernes. Si no es premium, no es aceptable.',
  );

  protected readonly twoFAEnabled = signal(true);
  protected readonly emailNotif = signal(true);
  protected readonly pushNotif = signal(false);
  protected readonly digestNotif = signal(true);
  protected readonly marketingNotif = signal(false);
  protected readonly mentionsNotif = signal(true);

  protected readonly integrations = signal<Integration[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: 'Sincroniza PRs, issues y commits en tu workspace.',
      icon: 'M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.19 1.78 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.83 1.19 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.79.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z',
      tone: 'from-ink-charcoal to-ink-dark',
      connected: true,
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Recibe notificaciones en tu canal #design.',
      icon: 'M5 15a2 2 0 1 0 0-4h2v4zM9 11V5a2 2 0 1 1 4 0v6M9 11h6v4a2 2 0 0 1-4 0V11zM19 9a2 2 0 1 0 0 4h-2V9z',
      tone: 'from-violet-500 to-purple-600',
      connected: true,
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Embebe docs de Notion en tus canvases.',
      icon: 'M4 4h16v16H4zM8 8h8v8H8z',
      tone: 'from-ink-charcoal to-ink-dark',
      connected: false,
    },
    {
      id: 'figma',
      name: 'Figma',
      description: 'Importa frames como assets del design system.',
      icon: 'M5 5.5a3.5 3.5 0 0 1 3.5-3.5H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zM12 9h3.5a3.5 3.5 0 1 1 0 7H12V9zM5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5zM5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z',
      tone: 'from-brand-pink to-fuchsia-500',
      connected: false,
    },
    {
      id: 'linear',
      name: 'Linear',
      description: 'Liga issues de Linear a commits y PRs.',
      icon: 'M12 2 2 12l10 10 10-10z',
      tone: 'from-primary-500 to-brand-deep',
      connected: false,
    },
  ]);

  protected readonly team: readonly TeamMember[] = [
    {
      name: 'Orbelin Jimenez',
      email: 'orbe@minimalmax.com',
      initials: 'OJ',
      tone: 'from-brand-6 to-brand-pink',
      role: 'admin',
    },
    {
      name: 'Sofia Reyes',
      email: 'sofia@minimalmax.com',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      role: 'editor',
    },
    {
      name: 'Diego Luna',
      email: 'diego@minimalmax.com',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
      role: 'editor',
    },
    {
      name: 'Ana Vega',
      email: 'ana@minimalmax.com',
      initials: 'AV',
      tone: 'from-amber-500 to-orange-500',
      role: 'viewer',
    },
  ];

  protected readonly dirty = signal(false);
  protected readonly deleteModalOpen = signal(false);
  protected readonly deleteConfirm = signal('');

  protected readonly canDelete = computed(
    () => this.deleteConfirm() === 'ELIMINAR',
  );

  protected setSection(id: string): void {
    this.activeSection.set(id);
  }

  protected markDirty(): void {
    this.dirty.set(true);
  }

  protected onName(event: Event): void {
    this.nameInput.set((event.target as HTMLInputElement).value);
    this.markDirty();
  }
  protected onHandle(event: Event): void {
    this.handleInput.set((event.target as HTMLInputElement).value);
    this.markDirty();
  }
  protected onEmail(event: Event): void {
    this.emailInput.set((event.target as HTMLInputElement).value);
    this.markDirty();
  }
  protected onBio(event: Event): void {
    this.bioInput.set((event.target as HTMLTextAreaElement).value);
    this.markDirty();
  }

  protected toggleIntegration(id: string): void {
    this.integrations.update((list) =>
      list.map((i) => (i.id === id ? { ...i, connected: !i.connected } : i)),
    );
    const target = this.integrations().find((i) => i.id === id);
    if (target?.connected) {
      this.toast.success(`${target.name} conectado`);
    } else if (target) {
      this.toast.info(`${target.name} desconectado`);
    }
  }

  protected toggleTwoFA(): void {
    this.twoFAEnabled.update((v) => !v);
    this.markDirty();
  }

  protected save(): void {
    this.dirty.set(false);
    this.toast.success('Cambios guardados', { title: 'Listo' });
  }

  protected discard(): void {
    this.dirty.set(false);
    this.toast.info('Cambios descartados');
  }

  protected openDelete(): void {
    this.deleteConfirm.set('');
    this.deleteModalOpen.set(true);
  }

  protected closeDelete(): void {
    this.deleteModalOpen.set(false);
  }

  protected onDeleteConfirm(event: Event): void {
    this.deleteConfirm.set((event.target as HTMLInputElement).value);
  }

  protected confirmDelete(): void {
    if (!this.canDelete()) return;
    this.closeDelete();
    this.toast.error('Cuenta marcada para eliminación');
  }

  protected roleLabel(role: TeamMember['role']): string {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'editor':
        return 'Editor';
      case 'viewer':
        return 'Viewer';
    }
  }

  protected roleClass(role: TeamMember['role']): string {
    switch (role) {
      case 'admin':
        return 'bg-cta text-cta-fg';
      case 'editor':
        return 'bg-primary-200 text-primary-700';
      case 'viewer':
        return 'bg-surface-secondary text-ink-secondary';
    }
  }

  protected readonly snippetsLayout: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'settings.html (layout completo)',
      code: `<!-- Layout: sidebar local + content + bottom dirty bar -->
<div class="rounded-mm-2xl border bg-surface-base shadow-mm-sm grid md:grid-cols-[220px_1fr]">

  <!-- Sidebar local con 7 secciones -->
  <aside class="border-r border-border-soft p-2">
    @for (s of sections; track s.id) {
      <button (click)="setSection(s.id)"
              [class.bg-surface-secondary]="activeSection() === s.id"
              [class.text-ink-dark]="activeSection() === s.id"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-mm-md">
        <svg viewBox="0 0 24 24" stroke="currentColor">
          <path [attr.d]="s.icon" />
        </svg>
        <span>{{ s.label }}</span>
        @if (activeSection() === s.id) {
          <span class="ml-auto w-1 h-4 bg-brand-6 rounded-mm-pill"></span>
        }
      </button>
    }
  </aside>

  <!-- Content: switch por sección -->
  <main class="p-6">
    @switch (activeSection()) {
      @case ('account') { <!-- Forms de cuenta --> }
      @case ('security') { <!-- 2FA toggle + password --> }
      @case ('billing') { <!-- Plan + payment method --> }
      @case ('integrations') { <!-- Lista con connect/disconnect --> }
      @case ('notifications') { <!-- Toggles --> }
      @case ('team') { <!-- Lista de miembros --> }
      @case ('danger') { <!-- Botones destructivos --> }
    }
  </main>
</div>

<!-- Sticky bottom bar cuando hay cambios sin guardar -->
@if (dirty()) {
  <div class="sticky bottom-4 mt-4 mx-auto max-w-2xl bg-cta text-cta-fg
              rounded-mm-xl shadow-mm-elevated p-4 flex justify-between"
       style="animation: fadeInDown 240ms;">
    <span>Tienes cambios sin guardar.</span>
    <div>
      <button (click)="discard()">Descartar</button>
      <button (click)="save()" class="bg-brand-6">Guardar cambios</button>
    </div>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'settings.ts (sections + active signal)',
      code: `interface SettingsSection {
  readonly id: string;
  readonly label: string;
  readonly icon: string;        // SVG path
  readonly description: string;
}

protected readonly sections: readonly SettingsSection[] = [
  { id: 'account',       label: 'Cuenta',          icon: '...', description: '...' },
  { id: 'security',      label: 'Seguridad',       icon: '...', description: '...' },
  { id: 'billing',       label: 'Facturación',     icon: '...', description: '...' },
  { id: 'integrations',  label: 'Integraciones',   icon: '...', description: '...' },
  { id: 'notifications', label: 'Notificaciones',  icon: '...', description: '...' },
  { id: 'team',          label: 'Equipo',          icon: '...', description: '...' },
  { id: 'danger',        label: 'Danger zone',     icon: '...', description: '...' },
];

protected readonly activeSection = signal<string>('account');
protected readonly dirty = signal(false);

// Cualquier cambio en un input dispara markDirty()
protected markDirty(): void {
  this.dirty.set(true);
}

protected save(): void {
  this.dirty.set(false);
  this.toast.success('Cambios guardados');
}`,
    },
  ];

  protected readonly snippetsSidebar: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'settings-sidebar.html',
      code: `<aside class="flex flex-col gap-0.5 p-2 rounded-mm-xl bg-surface-base border">
  @for (section of sections; track section.id) {
    <button
      type="button"
      (click)="setSection(section.id)"
      [attr.aria-current]="activeSection() === section.id ? 'page' : null"
      class="group relative flex items-center gap-3 px-3 py-2.5 rounded-mm-md
             text-left transition-all duration-200 mm-press"
      [class.bg-surface-secondary]="activeSection() === section.id"
      [class.text-ink-dark]="activeSection() === section.id"
      [class.text-ink-secondary]="activeSection() !== section.id"
      [class.hover:bg-surface-secondary/50]="activeSection() !== section.id"
      [class.hover:text-ink-dark]="activeSection() !== section.id"
    >
      <span class="size-7 rounded-mm-sm grid place-items-center transition-transform
                   duration-300 group-hover:scale-105 group-hover:rotate-3"
            [class.bg-brand-6]="activeSection() === section.id"
            [class.text-white]="activeSection() === section.id"
            [class.bg-surface-secondary]="activeSection() !== section.id">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path [attr.d]="section.icon" />
        </svg>
      </span>
      <span class="text-sm font-medium flex-1 truncate">{{ section.label }}</span>
      @if (activeSection() === section.id) {
        <span class="size-1.5 rounded-full bg-brand-6"
              style="animation: mm-check-pop 320ms var(--ease-bounce);"></span>
      }
    </button>
  }
</aside>`,
    },
  ];

  protected readonly snippetsDirty: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dirty-banner.html',
      code: `@if (dirty()) {
  <div
    class="sticky bottom-4 z-10 mx-auto max-w-2xl rounded-mm-xl bg-cta text-cta-fg
           shadow-mm-elevated px-5 py-3 flex items-center justify-between gap-3"
    style="animation: fadeInDown 240ms var(--ease-out) both;"
  >
    <span class="inline-flex items-center gap-2 text-sm">
      <span class="size-2 rounded-full bg-warning animate-pulse"></span>
      Tienes cambios sin guardar.
    </span>
    <div class="flex items-center gap-2">
      <button (click)="discard()"
              class="rounded-mm-md bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs">
        Descartar
      </button>
      <button (click)="save()"
              class="rounded-mm-md bg-brand-6 hover:bg-primary-700 px-4 py-1.5 text-xs font-semibold">
        Guardar cambios
      </button>
    </div>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'dirty signal + save/discard',
      code: `protected readonly dirty = signal(false);

// Cada input handler dispara markDirty()
protected markDirty(): void {
  this.dirty.set(true);
}

protected onName(event: Event): void {
  this.nameInput.set((event.target as HTMLInputElement).value);
  this.markDirty();  // ← clave: cada change activa el banner
}

// Save: flip flag + toast feedback
protected save(): void {
  this.dirty.set(false);
  this.toast.success('Cambios guardados', { title: 'Listo' });
  // Aquí iría el POST a la API real
}

protected discard(): void {
  this.dirty.set(false);
  this.toast.info('Cambios descartados');
  // Resetear los signals de input a sus valores originales si necesario
}`,
    },
  ];

  protected readonly snippetsDanger: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'danger-zone.html',
      code: `<div class="rounded-mm-2xl border border-error/30 bg-error-bg/30 p-5 space-y-4">
  <header class="flex items-center gap-2">
    <svg class="size-5 text-error" viewBox="0 0 24 24"><!-- warning --></svg>
    <h3 class="font-display text-base font-medium text-error">Danger zone</h3>
  </header>

  <div class="rounded-mm-xl border border-error/40 bg-surface-base p-4
              flex items-center justify-between gap-3">
    <div>
      <p class="font-medium text-sm">Eliminar cuenta</p>
      <p class="text-xs text-ink-muted">
        Esta acción es permanente. Se eliminarán todos tus proyectos y datos.
      </p>
    </div>
    <button (click)="openDelete()"
            class="rounded-mm-md bg-error text-white px-4 py-2 text-xs font-medium">
      Eliminar
    </button>
  </div>
</div>

<!-- Modal de confirmación con typing requirement -->
@if (deleteModalOpen()) {
  <mm-modal-shell (closed)="closeDelete()" title="¿Estás seguro?">
    <p>Para confirmar, escribe <strong>ELIMINAR</strong>:</p>
    <input [value]="deleteConfirm()" (input)="onDeleteConfirm($event)" />
    <button [disabled]="!canDelete()" (click)="confirmDelete()">
      Eliminar permanentemente
    </button>
  </mm-modal-shell>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'confirm-by-typing pattern',
      code: `protected readonly deleteModalOpen = signal(false);
protected readonly deleteConfirm = signal('');

// Solo permite eliminar si el usuario tipea exactamente "ELIMINAR"
protected readonly canDelete = computed(
  () => this.deleteConfirm() === 'ELIMINAR',
);

protected openDelete(): void {
  this.deleteConfirm.set(''); // reset al abrir
  this.deleteModalOpen.set(true);
}

protected onDeleteConfirm(event: Event): void {
  this.deleteConfirm.set((event.target as HTMLInputElement).value);
}

protected confirmDelete(): void {
  if (!this.canDelete()) return;  // guard
  this.closeDelete();
  // POST /api/user/delete con confirmation
  this.toast.error('Cuenta marcada para eliminación');
}`,
    },
  ];
}
