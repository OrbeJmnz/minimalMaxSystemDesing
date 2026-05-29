import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  PLATFORM_ID,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';
import { ClickOutsideDirective } from '@minimax/ui-angular';

interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly destructive?: boolean;
  readonly shortcut?: string;
}

interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly action: () => void;
  readonly group: string;
  readonly icon: string;
}

@Component({
  selector: 'mm-dropdown',
  imports: [
    ReactiveFormsModule,
    CanvasFrameComponent,
    SectionHeaderComponent,
    RippleDirective,
    ClickOutsideDirective,
  ],
  templateUrl: './dropdown.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class DropdownComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('commandInput') protected commandInput?: ElementRef<HTMLInputElement>;

  protected readonly menuOpen = signal(false);
  protected readonly userMenuOpen = signal(false);

  protected readonly menuItems: readonly MenuItem[] = [
    {
      id: 'duplicate',
      label: 'Duplicar',
      icon: 'M20 9h-9a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1',
      shortcut: '⌘D',
    },
    {
      id: 'share',
      label: 'Compartir',
      icon: 'M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13',
      shortcut: '⌘S',
    },
    { id: 'archive', label: 'Archivar', icon: 'M21 8v13H3V8M1 3h22v5H1zM10 12h4' },
    {
      id: 'delete',
      label: 'Eliminar…',
      icon: 'M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2',
      destructive: true,
    },
  ];

  protected readonly paletteOpen = signal(false);
  protected readonly paletteQuery = new FormControl<string>('', { nonNullable: true });
  protected readonly paletteActive = signal(0);

  protected readonly commands: readonly CommandItem[] = [
    {
      id: 'nav-overview',
      label: 'Ir a Overview',
      hint: 'Página principal',
      group: 'Navegar',
      icon: 'M3 9 12 2l9 7v11a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-5h-4v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      action: () => this.router.navigateByUrl('/overview'),
    },
    {
      id: 'nav-buttons',
      label: 'Ir a Buttons',
      hint: '5 variantes + ripple',
      group: 'Navegar',
      icon: 'M7 8h10M7 12h10M7 16h4',
      action: () => this.router.navigateByUrl('/buttons'),
    },
    {
      id: 'nav-inputs',
      label: 'Ir a Inputs',
      hint: 'Floating labels',
      group: 'Navegar',
      icon: 'M3 6h18M3 12h18M3 18h12',
      action: () => this.router.navigateByUrl('/inputs'),
    },
    {
      id: 'nav-forms',
      label: 'Ir a Forms',
      hint: 'Select · Check · Radio',
      group: 'Navegar',
      icon: 'M3 9 12 2l9 7v11a2 2 0 0 1-2 2h-3a2 2 0 0 1-2-2v-5h-4v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
      action: () => this.router.navigateByUrl('/forms'),
    },
    {
      id: 'nav-cards',
      label: 'Ir a Cards',
      hint: 'Gradient + glass',
      group: 'Navegar',
      icon: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
      action: () => this.router.navigateByUrl('/cards'),
    },
    {
      id: 'nav-data',
      label: 'Ir a Data',
      hint: 'Table · Accordion · Timeline',
      group: 'Navegar',
      icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z',
      action: () => this.router.navigateByUrl('/data-display'),
    },
    {
      id: 'theme-toggle',
      label: 'Cambiar tema',
      hint: 'Light ↔ Dark',
      group: 'Acciones',
      icon: 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z',
      action: () => document.documentElement.toggleAttribute('data-theme'),
    },
    {
      id: 'github',
      label: 'Abrir GitHub',
      hint: 'Repositorio del proyecto',
      group: 'Acciones',
      icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
      action: () => window.open('https://github.com', '_blank'),
    },
  ];

  protected readonly filteredCommands = computed(() => {
    const term = this.paletteQuery.value?.trim().toLowerCase() ?? '';
    if (!term) return this.commands;
    return this.commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(term) || cmd.hint.toLowerCase().includes(term),
    );
  });

  protected readonly groupedCommands = computed(() => {
    const groups = new Map<string, CommandItem[]>();
    for (const cmd of this.filteredCommands()) {
      const list = groups.get(cmd.group) ?? [];
      list.push(cmd);
      groups.set(cmd.group, list);
    }
    return Array.from(groups.entries()).map(([group, items]) => ({ group, items }));
  });

  ngAfterViewInit(): void {
    // focus on open
  }

  protected openPalette(): void {
    this.paletteOpen.set(true);
    this.paletteActive.set(0);
    setTimeout(() => this.commandInput?.nativeElement.focus(), 50);
  }

  protected closePalette(): void {
    this.paletteOpen.set(false);
    this.paletteQuery.setValue('');
  }

  protected runCommand(cmd: CommandItem): void {
    cmd.action();
    this.closePalette();
  }

  @HostListener('document:keydown', ['$event'])
  protected onKeydown(event: KeyboardEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.paletteOpen() ? this.closePalette() : this.openPalette();
      return;
    }

    if (!this.paletteOpen()) return;

    const list = this.filteredCommands();
    if (event.key === 'Escape') {
      this.closePalette();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.paletteActive.update((i) => Math.min(list.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.paletteActive.update((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter') {
      const cmd = list[this.paletteActive()];
      if (cmd) this.runCommand(cmd);
    }
  }

  protected readonly snippetsDropdownMenu: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dropdown.html',
      code: `<div
  class="relative inline-block"
  (mmClickOutside)="menuOpen.set(false)"
  [mmClickOutsideEnabled]="menuOpen()"
>
  <button
    type="button"
    mmRipple
    (click)="menuOpen.set(!menuOpen())"
    [class.!bg-cta]="menuOpen()"
    [class.!text-white]="menuOpen()"
    class="inline-flex items-center gap-2 rounded-mm-md bg-surface-secondary
           px-4 py-2 text-sm font-medium text-ink-dark hover:bg-border
           transition mm-press"
    [attr.aria-expanded]="menuOpen()"
  >
    Acciones
    <svg class="size-4 transition-transform" [class.rotate-180]="menuOpen()"><!-- chevron --></svg>
  </button>

  @if (menuOpen()) {
    <div
      class="absolute z-40 top-full mt-2 left-0 w-60 rounded-mm-xl
             border border-border-soft bg-surface-base shadow-mm-elevated
             overflow-hidden py-1"
      style="animation: scaleIn 200ms var(--ease-out) both;
             transform-origin: top left;"
      role="menu"
    >
      @for (item of menuItems; track item.id; let last = $last) {
        @if (item.destructive && !last) {
          <div class="border-t border-border-soft my-1"></div>
        }
        <button
          type="button"
          role="menuitem"
          (click)="menuOpen.set(false)"
          class="w-full flex items-center justify-between gap-3 px-3 py-2 text-sm"
          [class.text-ink-dark]="!item.destructive"
          [class.text-error]="item.destructive"
        >
          <span class="flex items-center gap-2.5">
            <svg class="size-4"><path [attr.d]="item.icon"></path></svg>
            {{ item.label }}
          </span>
          @if (item.shortcut) {
            <kbd class="font-mono text-[10px] px-1.5 py-0.5 rounded-mm-sm
                        border border-border bg-surface-secondary">
              {{ item.shortcut }}
            </kbd>
          }
        </button>
      }
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'dropdown.ts',
      code: `interface MenuItem {
  readonly id: string;
  readonly label: string;
  readonly icon: string;
  readonly destructive?: boolean;
  readonly shortcut?: string;
}

protected readonly menuOpen = signal(false);

protected readonly menuItems: readonly MenuItem[] = [
  { id: 'duplicate', label: 'Duplicar', icon: '...', shortcut: '⌘D' },
  { id: 'share',     label: 'Compartir', icon: '...', shortcut: '⌘S' },
  { id: 'archive',   label: 'Archivar', icon: '...' },
  { id: 'delete',    label: 'Eliminar…', icon: '...', destructive: true },
];`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css',
      code: `/* scaleIn — el "pop" del menú al aparecer */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}

/* mm-press — micro-feedback al hacer click */
.mm-press            { transition: transform var(--duration-fast) var(--ease-out); }
.mm-press:active     { transform: scale(0.97); }`,
    },
  ];

  protected readonly snippetsUserMenu: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dropdown.html',
      code: `<div
  class="relative inline-block"
  (mmClickOutside)="userMenuOpen.set(false)"
  [mmClickOutsideEnabled]="userMenuOpen()"
>
  <button
    type="button"
    (click)="userMenuOpen.set(!userMenuOpen())"
    class="inline-flex items-center gap-2 rounded-mm-pill p-1 pr-3
           hover:bg-surface-secondary transition mm-press"
  >
    <span class="size-8 rounded-mm-pill bg-linear-to-br from-brand-6 to-brand-pink
                 grid place-items-center text-white text-xs font-semibold">
      OJ
    </span>
    <span class="text-sm font-medium text-ink-dark">Orbe</span>
    <svg class="size-4 text-ink-muted transition-transform"
         [class.rotate-180]="userMenuOpen()"><!-- chevron --></svg>
  </button>

  @if (userMenuOpen()) {
    <div
      class="absolute z-40 top-full right-0 mt-2 w-64 rounded-mm-xl
             border border-border-soft bg-surface-base shadow-mm-elevated
             overflow-hidden"
      style="animation: scaleIn 200ms var(--ease-out) both;
             transform-origin: top right;"
    >
      <div class="px-4 py-3 border-b border-border-soft">
        <p class="font-display text-sm font-semibold">Orbe Jimenez</p>
        <p class="text-xs text-ink-muted">orbe@MinimalMax.dev</p>
      </div>
      <div class="py-1">
        <!-- items: Mi perfil, Configuración, Ayuda -->
      </div>
      <div class="border-t border-border-soft py-1">
        <button class="w-full flex items-center gap-2.5 px-4 py-2 text-sm
                       text-error hover:bg-error-bg transition">
          Cerrar sesión
        </button>
      </div>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'dropdown.ts',
      code: `protected readonly userMenuOpen = signal(false);

// ClickOutsideDirective cierra el menú al click fuera.
// El binding [mmClickOutsideEnabled] sólo lo activa cuando está abierto.`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — scaleIn',
      code: `/* scaleIn — entrada con escala para menús/popovers (token --animate-scale-in) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
/* uso típico: class="origin-top animate-[scaleIn_180ms_var(--ease-out)]" */`,
    },
  ];

  protected readonly snippetsCommandPalette: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'dropdown.html',
      code: `<button
  type="button"
  mmRipple
  (click)="openPalette()"
  class="inline-flex items-center gap-3 rounded-mm-md bg-surface-secondary
         px-4 py-2.5 text-sm font-medium text-ink-dark hover:bg-border
         transition mm-press"
>
  <svg class="size-4 text-ink-muted"><!-- search --></svg>
  Buscar comando…
  <kbd class="font-mono text-[10px] px-1.5 py-0.5 rounded-mm-sm
              border border-border bg-surface-base">
    ⌘K
  </kbd>
</button>

@if (paletteOpen()) {
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
    role="dialog"
    aria-modal="true"
    style="animation: fadeIn 200ms var(--ease-out) both;"
  >
    <button (click)="closePalette()" aria-label="Cerrar"
            class="absolute inset-0 bg-black/55 backdrop-blur-sm"></button>

    <div class="relative w-full max-w-xl rounded-mm-2xl border border-border-soft
                bg-surface-base shadow-mm-elevated overflow-hidden"
         style="animation: scaleIn 240ms var(--ease-out) both;">
      <input
        #commandInput
        type="text"
        [formControl]="paletteQuery"
        placeholder="Buscar comando o navegar a…"
        class="flex-1 bg-transparent text-base focus:outline-none"
      />

      <ul class="max-h-96 overflow-y-auto py-2">
        @for (group of groupedCommands(); track group.group) {
          <li>
            <p class="px-3 py-1.5 text-[10px] uppercase font-semibold">{{ group.group }}</p>
            @for (cmd of group.items; track cmd.id) {
              <button (mousedown)="runCommand(cmd)"
                      [class.bg-primary-200/40]="filteredCommands()[paletteActive()]?.id === cmd.id">
                {{ cmd.label }}
              </button>
            }
          </li>
        } @empty {
          <li class="px-4 py-8 text-center">Sin comandos para "{{ paletteQuery.value }}"</li>
        }
      </ul>
    </div>
  </div>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'dropdown.ts',
      code: `interface CommandItem {
  readonly id: string;
  readonly label: string;
  readonly hint: string;
  readonly group: string;
  readonly icon: string;
  readonly action: () => void;
}

protected readonly paletteOpen = signal(false);
protected readonly paletteQuery = new FormControl<string>('', { nonNullable: true });
protected readonly paletteActive = signal(0);

protected readonly filteredCommands = computed(() => {
  const term = this.paletteQuery.value?.trim().toLowerCase() ?? '';
  if (!term) return this.commands;
  return this.commands.filter(
    (c) => c.label.toLowerCase().includes(term) || c.hint.toLowerCase().includes(term),
  );
});

protected openPalette(): void {
  this.paletteOpen.set(true);
  this.paletteActive.set(0);
  setTimeout(() => this.commandInput?.nativeElement.focus(), 50);
}

@HostListener('document:keydown', ['$event'])
protected onKeydown(event: KeyboardEvent): void {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    this.paletteOpen() ? this.closePalette() : this.openPalette();
    return;
  }
  if (!this.paletteOpen()) return;
  const list = this.filteredCommands();
  if (event.key === 'Escape')         this.closePalette();
  else if (event.key === 'ArrowDown') this.paletteActive.update((i) => Math.min(list.length - 1, i + 1));
  else if (event.key === 'ArrowUp')   this.paletteActive.update((i) => Math.max(0, i - 1));
  else if (event.key === 'Enter')     { const c = list[this.paletteActive()]; if (c) this.runCommand(c); }
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — fadeIn + scaleIn',
      code: `/* fadeIn — backdrop / overlay por opacidad (token --animate-fade-in) */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

/* scaleIn — entrada con escala para menús/popovers (token --animate-scale-in) */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.94); }
  to   { opacity: 1; transform: scale(1); }
}
/* uso típico: class="origin-top animate-[scaleIn_180ms_var(--ease-out)]" */`,
    },
  ];
}
