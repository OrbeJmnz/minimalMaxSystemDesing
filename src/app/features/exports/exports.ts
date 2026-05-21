import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { RippleDirective } from '../../shared/directives/ripple.directive';
import { ToastService } from '../../core/services/toast.service';

interface Row {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly status: string;
  readonly progress: number;
  readonly amount: number;
}

@Component({
  selector: 'mm-exports',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    RippleDirective,
  ],
  templateUrl: './exports.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class ExportsComponent {
  private readonly toast = inject(ToastService);

  protected readonly copied = signal(false);

  protected readonly rows: readonly Row[] = [
    { id: '#001', name: 'MinimalMax Showcase', owner: 'Orbe Jimenez', status: 'Live', progress: 92, amount: 12450 },
    { id: '#002', name: 'Spacer Onboarding', owner: 'Sofia Reyes', status: 'Building', progress: 64, amount: 4800 },
    { id: '#003', name: 'Tortugas Marinas API', owner: 'Diego Luna', status: 'Live', progress: 100, amount: 9200 },
    { id: '#004', name: 'TasGuard Dashboard', owner: 'Ana Vega', status: 'En pausa', progress: 38, amount: 2100 },
    { id: '#005', name: 'InventarioLibero', owner: 'Luis Mora', status: 'Building', progress: 71, amount: 7600 },
  ];

  protected exportCSV(): void {
    const headers = ['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto'];
    const lines = this.rows.map((row) =>
      [row.id, row.name, row.owner, row.status, `${row.progress}%`, `$${row.amount}`].join(','),
    );
    const csv = [headers.join(','), ...lines].join('\n');
    this.downloadBlob(csv, 'MinimalMax-export.csv', 'text/csv;charset=utf-8');
    this.toast.success('CSV descargado', { title: 'Listo' });
  }

  protected exportJSON(): void {
    const json = JSON.stringify(this.rows, null, 2);
    this.downloadBlob(json, 'MinimalMax-export.json', 'application/json');
    this.toast.success('JSON descargado', { title: 'Listo' });
  }

  protected exportExcel(): void {
    // Demo: el patrón real usaría import('xlsx') lazy.
    // Aquí descargamos como TSV que Excel abre nativamente.
    const headers = ['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto'];
    const lines = this.rows.map((row) =>
      [row.id, row.name, row.owner, row.status, `${row.progress}%`, `$${row.amount}`].join('\t'),
    );
    const tsv = [headers.join('\t'), ...lines].join('\n');
    this.downloadBlob(tsv, 'MinimalMax-export.xls', 'application/vnd.ms-excel');
    this.toast.success('Archivo .xls descargado', {
      title: 'Excel',
      action: { label: 'Abrir docs jspdf', run: () => window.open('https://docs.sheetjs.com', '_blank') },
    });
  }

  protected exportPDF(): void {
    // Patrón portable sin libs: usar window.print() con CSS @media print.
    // Para PDF real, sustituir por `import('jspdf').then(...)`.
    this.toast.info('Abriendo diálogo de impresión…', { title: 'PDF' });
    setTimeout(() => window.print(), 300);
  }

  protected async copyTable(): Promise<void> {
    const headers = ['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto'];
    const lines = this.rows.map((row) =>
      [row.id, row.name, row.owner, row.status, `${row.progress}%`, `$${row.amount}`].join('\t'),
    );
    const tsv = [headers.join('\t'), ...lines].join('\n');
    try {
      await navigator.clipboard.writeText(tsv);
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
      this.toast.success('Tabla copiada al portapapeles');
    } catch {
      this.toast.error('No se pudo copiar');
    }
  }

  protected print(): void {
    window.print();
  }

  private downloadBlob(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  protected readonly snippetsAccionesDeExport: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'exports.html',
      code: `<div data-stagger class="flex flex-wrap gap-3">
  <button type="button" mmRipple (click)="exportPDF()"
          class="inline-flex items-center gap-2 rounded-mm-md bg-error
                 px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm
                 hover:shadow-mm-elevated transition mm-press">
    <svg class="size-4"><!-- file-text icon --></svg>
    Export PDF
  </button>

  <button type="button" mmRipple (click)="exportExcel()"
          class="inline-flex items-center gap-2 rounded-mm-md bg-success
                 px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm
                 hover:shadow-mm-elevated transition mm-press">
    <svg class="size-4"><!-- file-check icon --></svg>
    Export Excel
  </button>

  <button type="button" mmRipple (click)="exportCSV()"
          class="inline-flex items-center gap-2 rounded-mm-md bg-cta
                 px-5 py-2.5 text-sm font-medium text-white shadow-mm-sm
                 hover:shadow-mm-elevated transition mm-press">
    <svg class="size-4"><!-- download icon --></svg>
    CSV
  </button>

  <button type="button" mmRipple (click)="exportJSON()"
          class="inline-flex items-center gap-2 rounded-mm-md bg-surface-secondary
                 px-5 py-2.5 text-sm font-medium text-ink-dark hover:bg-border
                 transition mm-press">
    <svg class="size-4"><!-- braces icon --></svg>
    JSON
  </button>

  <button type="button" mmRipple (click)="print()"
          class="inline-flex items-center gap-2 rounded-mm-md bg-surface-secondary
                 px-5 py-2.5 text-sm font-medium text-ink-dark hover:bg-border
                 transition mm-press">
    <svg class="size-4"><!-- printer icon --></svg>
    Imprimir
  </button>

  <button type="button" mmRipple (click)="copyTable()"
          [class.!bg-success]="copied()"
          [class.!text-white]="copied()"
          class="inline-flex items-center gap-2 rounded-mm-md border border-border
                 bg-surface-base px-5 py-2.5 text-sm font-medium text-ink-dark
                 hover:border-ink-dark transition mm-press">
    @if (copied()) {
      <svg class="size-4"><!-- check --></svg> Copiado
    } @else {
      <svg class="size-4"><!-- copy --></svg> Copiar tabla
    }
  </button>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'exports.ts',
      code: `protected readonly copied = signal(false);

protected exportCSV(): void {
  const headers = ['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto'];
  const lines = this.rows.map((r) =>
    [r.id, r.name, r.owner, r.status, \`\${r.progress}%\`, \`$\${r.amount}\`].join(','),
  );
  const csv = [headers.join(','), ...lines].join('\\n');
  this.downloadBlob(csv, 'MinimalMax-export.csv', 'text/csv;charset=utf-8');
  this.toast.success('CSV descargado', { title: 'Listo' });
}

protected exportJSON(): void {
  const json = JSON.stringify(this.rows, null, 2);
  this.downloadBlob(json, 'MinimalMax-export.json', 'application/json');
  this.toast.success('JSON descargado', { title: 'Listo' });
}

protected exportPDF(): void {
  // Sin libs: window.print() con CSS @media print.
  // Para PDF real, sustituir por: const { jsPDF } = await import('jspdf'); ...
  this.toast.info('Abriendo diálogo de impresión…', { title: 'PDF' });
  setTimeout(() => window.print(), 300);
}

protected async copyTable(): Promise<void> {
  const headers = ['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto'];
  const lines = this.rows.map((r) =>
    [r.id, r.name, r.owner, r.status, \`\${r.progress}%\`, \`$\${r.amount}\`].join('\\t'),
  );
  const tsv = [headers.join('\\t'), ...lines].join('\\n');
  try {
    await navigator.clipboard.writeText(tsv);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1800);
    this.toast.success('Tabla copiada al portapapeles');
  } catch {
    this.toast.error('No se pudo copiar');
  }
}

private downloadBlob(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}`,
    },
  ];

  protected readonly snippetsTablaDeOrigen: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'exports.html',
      code: `<div class="overflow-hidden rounded-mm-xl border border-border-soft">
  <div class="overflow-x-auto">
    <table class="w-full text-sm">
      <thead class="bg-surface-secondary/50 border-b border-border-soft text-left">
        <tr>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary">ID</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary">Nombre</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary">Owner</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary">Estado</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary text-right">Progreso</th>
          <th class="px-4 py-3 text-xs font-semibold uppercase tracking-wider
                     text-ink-secondary text-right">Monto</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-border-soft">
        @for (row of rows; track row.id) {
          <tr class="hover:bg-surface-secondary/40 transition-colors">
            <td class="px-4 py-3 font-mono text-xs text-ink-muted">{{ row.id }}</td>
            <td class="px-4 py-3 font-medium text-ink-dark">{{ row.name }}</td>
            <td class="px-4 py-3 text-ink-secondary">{{ row.owner }}</td>
            <td class="px-4 py-3">
              <span class="rounded-mm-pill bg-surface-secondary text-ink-dark
                           px-2.5 py-0.5 text-xs">
                {{ row.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-right font-mono text-ink-dark tabular-nums">
              {{ row.progress }}%
            </td>
            <td class="px-4 py-3 text-right font-mono text-ink-dark tabular-nums">
              \${{ row.amount.toLocaleString() }}
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'exports.ts',
      code: `interface Row {
  readonly id: string;
  readonly name: string;
  readonly owner: string;
  readonly status: string;
  readonly progress: number;
  readonly amount: number;
}

protected readonly rows: readonly Row[] = [
  { id: '#001', name: 'MinimalMax Showcase', owner: 'Orbe Jimenez', status: 'Live',     progress: 92,  amount: 12450 },
  { id: '#002', name: 'Spacer Onboarding',   owner: 'Sofia Reyes',  status: 'Building', progress: 64,  amount: 4800 },
  { id: '#003', name: 'Tortugas Marinas API',owner: 'Diego Luna',   status: 'Live',     progress: 100, amount: 9200 },
  { id: '#004', name: 'TasGuard Dashboard',  owner: 'Ana Vega',     status: 'En pausa', progress: 38,  amount: 2100 },
  { id: '#005', name: 'InventarioLibero',    owner: 'Luis Mora',    status: 'Building', progress: 71,  amount: 7600 },
];`,
    },
  ];

  protected readonly snippetsPatronLazyLoadParaLibsGrandes: readonly CanvasFrameSnippet[] = [
    {
      label: 'TS',
      lang: 'ts',
      title: 'exports.ts',
      code: `// PDF con jspdf — carga lazy (200+ KB no entran al bundle inicial)
async exportPDF(): Promise<void> {
  const { jsPDF } = await import('jspdf');
  await import('jspdf-autotable'); // plugin de tablas
  const doc = new jsPDF();
  doc.text('Reporte MinimalMax', 14, 20);
  (doc as any).autoTable({
    head: [['ID', 'Nombre', 'Owner', 'Estado', 'Progreso', 'Monto']],
    body: this.rows.map((r) => [r.id, r.name, r.owner, r.status, r.progress + '%', r.amount]),
  });
  doc.save('reporte.pdf');
}

// Excel con xlsx (SheetJS) — carga lazy
async exportExcel(): Promise<void> {
  const XLSX = await import('xlsx');
  const ws = XLSX.utils.json_to_sheet(this.rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Proyectos');
  XLSX.writeFile(wb, 'reporte.xlsx');
}`,
    },
    {
      label: 'HTML',
      lang: 'html',
      title: 'exports.html',
      code: `<!-- Bloque de código mostrado en el demo (puramente visual) -->
<pre class="font-mono text-xs leading-relaxed bg-cta text-white/90 p-5
            rounded-mm-xl overflow-x-auto">
<code>// PDF con jspdf — carga lazy
async exportPDF() {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.text('Reporte MinimalMax', 14, 20);
  doc.autoTable({ head: [headers], body: rows });
  doc.save('reporte.pdf');
}</code>
</pre>`,
    },
  ];
}
