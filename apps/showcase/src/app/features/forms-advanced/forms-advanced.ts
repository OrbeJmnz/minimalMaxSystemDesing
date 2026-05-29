import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { ClickOutsideDirective } from '../../shared/directives/click-outside.directive';
import { ToastService } from '../../core/services/toast.service';

interface Tag {
  readonly id: string;
  readonly label: string;
  readonly color: string;
}

interface FileItem {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

@Component({
  selector: 'mm-forms-advanced',
  imports: [
    ReactiveFormsModule,
    CanvasFrameComponent,
    SectionHeaderComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './forms-advanced.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class FormsAdvancedComponent {
  private readonly toast = inject(ToastService);

  protected readonly dateCtrl = new FormControl<string>('2026-05-15', { nonNullable: true });
  protected readonly dateRangeFrom = new FormControl<string>('2026-05-01', { nonNullable: true });
  protected readonly dateRangeTo = new FormControl<string>('2026-05-30', { nonNullable: true });

  protected readonly files = signal<readonly FileItem[]>([]);
  protected readonly dragging = signal(false);
  private fileIdCounter = 0;

  protected readonly comboboxQuery = new FormControl<string>('', { nonNullable: true });
  protected readonly comboboxOpen = signal(false);
  protected readonly comboboxSelected = signal<Tag | null>(null);

  protected readonly allTags: readonly Tag[] = [
    {
      id: 'angular',
      label: 'Angular',
      color: 'bg-red-100 text-red-700 mm-dark:bg-red-900/40 mm-dark:text-red-300',
    },
    {
      id: 'tailwind',
      label: 'Tailwind',
      color: 'bg-cyan-100 text-cyan-700 mm-dark:bg-cyan-900/40 mm-dark:text-cyan-300',
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      color: 'bg-blue-100 text-blue-700 mm-dark:bg-blue-900/40 mm-dark:text-blue-300',
    },
    {
      id: 'signals',
      label: 'Signals',
      color: 'bg-violet-100 text-violet-700 mm-dark:bg-violet-900/40 mm-dark:text-violet-300',
    },
    {
      id: 'ssr',
      label: 'SSR',
      color: 'bg-emerald-100 text-emerald-700 mm-dark:bg-emerald-900/40 mm-dark:text-emerald-300',
    },
    {
      id: 'design-system',
      label: 'Design System',
      color: 'bg-fuchsia-100 text-fuchsia-700 mm-dark:bg-fuchsia-900/40 mm-dark:text-fuchsia-300',
    },
    {
      id: 'accessibility',
      label: 'Accesibilidad',
      color: 'bg-amber-100 text-amber-700 mm-dark:bg-amber-900/40 mm-dark:text-amber-300',
    },
    {
      id: 'animations',
      label: 'Animaciones',
      color: 'bg-pink-100 text-pink-700 mm-dark:bg-pink-900/40 mm-dark:text-pink-300',
    },
  ];

  protected readonly comboboxFiltered = computed(() => {
    const term = this.comboboxQuery.value?.trim().toLowerCase() ?? '';
    if (!term) return this.allTags;
    return this.allTags.filter((tag) => tag.label.toLowerCase().includes(term));
  });

  protected readonly multiSelected = signal<readonly Tag[]>([this.allTags[0], this.allTags[2]]);
  protected readonly multiOpen = signal(false);

  protected readonly multiAvailable = computed(() =>
    this.allTags.filter((tag) => !this.multiSelected().some((t) => t.id === tag.id)),
  );

  protected toggleCombobox(open?: boolean): void {
    this.comboboxOpen.set(open ?? !this.comboboxOpen());
  }

  protected pickFromCombobox(tag: Tag): void {
    this.comboboxSelected.set(tag);
    this.comboboxQuery.setValue(tag.label);
    this.comboboxOpen.set(false);
  }

  protected toggleMulti(open?: boolean): void {
    this.multiOpen.set(open ?? !this.multiOpen());
  }

  protected addToMulti(tag: Tag): void {
    this.multiSelected.update((items) => [...items, tag]);
  }

  protected removeFromMulti(tag: Tag): void {
    this.multiSelected.update((items) => items.filter((t) => t.id !== tag.id));
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(true);
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragging.set(false);
    const list = event.dataTransfer?.files;
    if (list && list.length > 0) {
      this.addFiles(Array.from(list));
    }
  }

  protected onFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.addFiles(Array.from(input.files));
      input.value = '';
    }
  }

  protected addFiles(items: File[]): void {
    const next: FileItem[] = items.map((file) => ({
      id: `f${++this.fileIdCounter}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
    }));
    this.files.update((current) => [...current, ...next]);
    this.toast.success(
      `${next.length} archivo${next.length === 1 ? '' : 's'} agregado${next.length === 1 ? '' : 's'}`,
      {
        title: 'Listo',
      },
    );
  }

  protected removeFile(id: string): void {
    this.files.update((current) => current.filter((file) => file.id !== id));
  }

  protected formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  protected readonly snippetsDatePicker: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms-advanced.html',
      code: `<label class="flex flex-col gap-1.5">
  <span class="text-xs font-medium text-ink-dark">Fecha de inicio</span>
  <div class="group relative flex items-center rounded-mm-md border-2 border-border
              bg-surface-base focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10
              transition-[border-color,box-shadow] duration-200">
    <svg class="absolute left-4 size-4 text-ink-muted pointer-events-none
                group-focus-within:text-primary-500 transition-colors"
         viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
         stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
    </svg>
    <input
      type="date"
      [formControl]="dateCtrl"
      class="mm-input-bare w-full pl-11 pr-3 py-2.5 text-sm text-ink-dark cursor-pointer"
    />
  </div>
</label>

<!-- Hora con icono reloj -->
<label class="flex flex-col gap-1.5">
  <span class="text-xs font-medium text-ink-dark">Hora</span>
  <div class="group relative flex items-center rounded-mm-md border-2 border-border
              bg-surface-base focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10">
    <!-- icono clock + input type="time" con mm-input-bare -->
    <input type="time" value="14:30"
           class="mm-input-bare w-full pl-11 pr-3 py-2.5 text-sm text-ink-dark cursor-pointer"/>
  </div>
</label>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms-advanced.ts (extracto)',
      code: `protected readonly dateCtrl = new FormControl<string>('2026-05-15', {
  nonNullable: true,
});`,
    },
  ];

  protected readonly snippetsDateRange: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms-advanced.html',
      code: `<div class="inline-flex flex-col md:flex-row items-stretch rounded-mm-md
            border-2 border-border bg-surface-base
            focus-within:border-primary-500
            focus-within:ring-3 focus-within:ring-primary-500/10
            transition-[border-color,box-shadow] duration-200
            overflow-hidden max-w-full">
  <label class="relative flex items-center gap-3 px-4 py-2.5 flex-1">
    <svg class="size-4 text-ink-muted shrink-0" viewBox="0 0 24 24"
         fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="4" width="18" height="18" rx="2"></rect>
      <path d="M16 2v4M8 2v4M3 10h18"></path>
    </svg>
    <span class="flex flex-col min-w-0">
      <span class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
        Desde
      </span>
      <input type="date" [formControl]="dateRangeFrom"
             class="mm-input-bare text-sm text-ink-dark"/>
    </span>
  </label>

  <!-- Divider (flecha en desktop, hr en mobile) -->
  <span class="hidden md:flex items-center px-3 text-ink-muted bg-border-soft/60
               border-l border-r border-border-soft" aria-hidden="true">
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"></path></svg>
  </span>
  <span class="md:hidden h-px bg-border-soft mx-4" aria-hidden="true"></span>

  <label class="relative flex items-center gap-3 px-4 py-2.5 flex-1">
    <!-- mismo patrón con dateRangeTo -->
  </label>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms-advanced.ts (extracto)',
      code: `protected readonly dateRangeFrom = new FormControl<string>('2026-05-01', {
  nonNullable: true,
});
protected readonly dateRangeTo = new FormControl<string>('2026-05-30', {
  nonNullable: true,
});`,
    },
  ];

  protected readonly snippetsFileUpload: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms-advanced.html',
      code: `<label
  (dragover)="onDragOver($event)"
  (dragleave)="onDragLeave($event)"
  (drop)="onDrop($event)"
  class="relative flex flex-col items-center justify-center gap-3 px-6 py-12
         rounded-mm-2xl border-2 border-dashed border-border
         bg-surface-secondary/30 cursor-pointer transition-all duration-200
         hover:border-primary-500 hover:bg-primary-200/10"
  [class.!border-brand-6]="dragging()"
  [class.!bg-primary-200/20]="dragging()"
  [class.!shadow-mm-brand]="dragging()"
>
  <input type="file" multiple (change)="onFileInput($event)" class="sr-only" />
  <div class="size-14 rounded-mm-pill bg-primary-200 text-brand-6 grid
              place-items-center transition-transform duration-300"
       [class.scale-110]="dragging()"
       [class.rotate-6]="dragging()">
    <!-- icono upload -->
  </div>
  <div class="text-center">
    <p class="font-display text-base font-medium text-ink-dark">
      {{ dragging() ? 'Suelta para subir' : 'Arrastra archivos o haz click' }}
    </p>
    <p class="text-xs text-ink-muted mt-1">PNG, JPG, PDF hasta 10 MB cada uno</p>
  </div>
</label>

@if (files().length > 0) {
  <ul data-stagger class="mt-5 flex flex-col gap-2">
    @for (file of files(); track file.id) {
      <li class="flex items-center gap-3 p-3 rounded-mm-md border border-border-soft
                 bg-surface-base shadow-mm-sm">
        <span class="size-10 shrink-0 rounded-mm-md bg-primary-200 text-brand-6
                     grid place-items-center">
          <!-- icono file -->
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-ink-dark truncate">{{ file.name }}</p>
          <p class="text-xs text-ink-muted font-mono">
            {{ formatSize(file.size) }} · {{ file.type }}
          </p>
        </div>
        <button type="button" (click)="removeFile(file.id)"
                aria-label="Eliminar archivo"
                class="size-8 rounded-mm-sm grid place-items-center text-ink-muted
                       hover:text-error hover:bg-error-bg transition mm-press">
          <!-- icono X -->
        </button>
      </li>
    }
  </ul>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms-advanced.ts (extracto)',
      code: `interface FileItem {
  readonly id: string;
  readonly name: string;
  readonly size: number;
  readonly type: string;
}

protected readonly files = signal<readonly FileItem[]>([]);
protected readonly dragging = signal(false);
private fileIdCounter = 0;

protected onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.dragging.set(true);
}

protected onDragLeave(event: DragEvent): void {
  event.preventDefault();
  this.dragging.set(false);
}

protected onDrop(event: DragEvent): void {
  event.preventDefault();
  this.dragging.set(false);
  const list = event.dataTransfer?.files;
  if (list && list.length > 0) {
    this.addFiles(Array.from(list));
  }
}

protected onFileInput(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.addFiles(Array.from(input.files));
    input.value = '';
  }
}

protected addFiles(items: File[]): void {
  const next: FileItem[] = items.map((file) => ({
    id: \`f\${++this.fileIdCounter}\`,
    name: file.name,
    size: file.size,
    type: file.type || 'application/octet-stream',
  }));
  this.files.update((current) => [...current, ...next]);
}

protected removeFile(id: string): void {
  this.files.update((current) => current.filter((f) => f.id !== id));
}

protected formatSize(bytes: number): string {
  if (bytes < 1024) return \`\${bytes} B\`;
  if (bytes < 1024 * 1024) return \`\${(bytes / 1024).toFixed(1)} KB\`;
  return \`\${(bytes / 1024 / 1024).toFixed(1)} MB\`;
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css (data-stagger anima la lista de archivos)',
      code: `[data-stagger] > * {
  opacity: 0;
  animation: var(--animate-fade-in-up);
}

/* Cada child se delay-ea para crear el efecto cascada */
[data-stagger] > *:nth-child(1) { animation-delay: 60ms; }
[data-stagger] > *:nth-child(2) { animation-delay: 120ms; }
[data-stagger] > *:nth-child(3) { animation-delay: 180ms; }
/* ... etc */`,
    },
  ];

  protected readonly snippetsCombobox: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms-advanced.html',
      code: `<div class="relative max-w-md"
     (mmClickOutside)="toggleCombobox(false)"
     [mmClickOutsideEnabled]="comboboxOpen()">
  <div class="flex items-center rounded-mm-md border-2 border-border bg-surface-base
              focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10
              transition-[border-color,box-shadow] duration-200"
       [class.!border-primary-500]="comboboxOpen()">
    <!-- icono search -->
    <input
      type="text"
      [formControl]="comboboxQuery"
      (focus)="toggleCombobox(true)"
      (blur)="toggleCombobox(false)"
      placeholder="Buscar tag..."
      class="mm-input-bare flex-1 px-3 py-2.5 text-sm text-ink-dark"
    />
    @if (comboboxSelected()) {
      <span class="mr-3 inline-flex items-center gap-1 rounded-mm-pill
                   px-2 py-0.5 text-[10px] font-semibold"
            [class]="comboboxSelected()!.color">
        {{ comboboxSelected()!.label }}
      </span>
    }
  </div>

  @if (comboboxOpen()) {
    <div class="absolute z-40 top-full mt-2 left-0 right-0 rounded-mm-xl
                border border-border-soft bg-surface-base shadow-mm-elevated
                overflow-hidden"
         style="animation: scaleIn 200ms var(--ease-out) both; transform-origin: top;">
      <ul class="max-h-60 overflow-y-auto py-1">
        @for (tag of comboboxFiltered(); track tag.id) {
          <li>
            <button type="button" (mousedown)="pickFromCombobox(tag)"
                    class="w-full flex items-center justify-between gap-3 px-4 py-2
                           text-sm hover:bg-surface-secondary transition cursor-pointer">
              <span class="inline-flex items-center rounded-mm-pill px-2 py-0.5
                           text-[10px] font-semibold" [class]="tag.color">
                {{ tag.label }}
              </span>
            </button>
          </li>
        } @empty {
          <li class="px-4 py-6 text-center text-sm text-ink-muted">
            Sin resultados para "{{ comboboxQuery.value }}"
          </li>
        }
      </ul>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms-advanced.ts (extracto)',
      code: `interface Tag {
  readonly id: string;
  readonly label: string;
  readonly color: string;
}

protected readonly allTags: readonly Tag[] = [
  { id: 'angular', label: 'Angular', color: 'bg-red-100 text-red-700 ...' },
  { id: 'tailwind', label: 'Tailwind', color: 'bg-cyan-100 text-cyan-700 ...' },
  // ...
];

protected readonly comboboxQuery = new FormControl<string>('', { nonNullable: true });
protected readonly comboboxOpen = signal(false);
protected readonly comboboxSelected = signal<Tag | null>(null);

// Filtrado reactivo (computed sobre el form control value)
protected readonly comboboxFiltered = computed(() => {
  const term = this.comboboxQuery.value?.trim().toLowerCase() ?? '';
  if (!term) return this.allTags;
  return this.allTags.filter((tag) => tag.label.toLowerCase().includes(term));
});

protected toggleCombobox(open?: boolean): void {
  this.comboboxOpen.set(open ?? !this.comboboxOpen());
}

protected pickFromCombobox(tag: Tag): void {
  this.comboboxSelected.set(tag);
  this.comboboxQuery.setValue(tag.label);
  this.comboboxOpen.set(false);
}`,
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

  protected readonly snippetsMultiSelect: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'forms-advanced.html',
      code: `<div class="relative max-w-xl"
     (mmClickOutside)="toggleMulti(false)"
     [mmClickOutsideEnabled]="multiOpen()">
  <div class="flex flex-wrap items-center gap-2 min-h-11 rounded-mm-md
              border-2 border-border bg-surface-base px-2 py-2
              focus-within:border-primary-500
              focus-within:ring-3 focus-within:ring-primary-500/10
              transition-[border-color,box-shadow] duration-200 cursor-text"
       (click)="toggleMulti(true)">
    @for (tag of multiSelected(); track tag.id) {
      <span class="inline-flex items-center gap-1.5 rounded-mm-pill pl-3 pr-1 py-1
                   text-xs font-medium"
            [class]="tag.color"
            style="animation: scaleIn 200ms var(--ease-out) both;">
        {{ tag.label }}
        <button type="button"
                (click)="removeFromMulti(tag); $event.stopPropagation()"
                [attr.aria-label]="'Quitar ' + tag.label"
                class="size-5 rounded-mm-pill grid place-items-center
                       hover:bg-black/10 transition mm-press">
          <!-- icono X -->
        </button>
      </span>
    } @empty {
      <span class="text-sm text-ink-muted pl-2 py-1">Click para agregar tags…</span>
    }
    <button type="button" (click)="toggleMulti(); $event.stopPropagation()"
            class="ml-auto size-7 rounded-mm-sm grid place-items-center
                   text-ink-muted hover:text-ink-dark hover:bg-surface-secondary
                   transition mm-press">
      <svg class="size-4 transition-transform duration-300"
           [class.rotate-180]="multiOpen()"
           viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="m6 9 6 6 6-6"></path>
      </svg>
    </button>
  </div>

  @if (multiOpen()) {
    <div class="absolute z-40 top-full mt-2 left-0 right-0 rounded-mm-xl
                border border-border-soft bg-surface-base shadow-mm-elevated"
         style="animation: scaleIn 200ms var(--ease-out) both;">
      <ul class="max-h-60 overflow-y-auto py-1">
        @for (tag of multiAvailable(); track tag.id) {
          <li>
            <button type="button" (click)="addToMulti(tag)"
                    class="w-full flex items-center gap-3 px-4 py-2 text-sm
                           hover:bg-surface-secondary transition text-left">
              <span class="inline-flex items-center rounded-mm-pill px-2 py-0.5
                           text-[10px] font-semibold" [class]="tag.color">
                {{ tag.label }}
              </span>
            </button>
          </li>
        }
      </ul>
    </div>
  }
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'forms-advanced.ts (extracto)',
      code: `protected readonly multiSelected = signal<readonly Tag[]>([
  this.allTags[0],
  this.allTags[2],
]);
protected readonly multiOpen = signal(false);

// Lo disponible es allTags menos lo ya seleccionado
protected readonly multiAvailable = computed(() =>
  this.allTags.filter(
    (tag) => !this.multiSelected().some((t) => t.id === tag.id),
  ),
);

protected toggleMulti(open?: boolean): void {
  this.multiOpen.set(open ?? !this.multiOpen());
}

protected addToMulti(tag: Tag): void {
  this.multiSelected.update((items) => [...items, tag]);
}

protected removeFromMulti(tag: Tag): void {
  this.multiSelected.update((items) => items.filter((t) => t.id !== tag.id));
}`,
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
}
