import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block';
import { DiffViewerComponent } from '../../shared/components/diff-viewer/diff-viewer';

@Component({
  selector: 'mm-code-display',
  imports: [
    CanvasFrameComponent,
    SectionHeaderComponent,
    CodeBlockComponent,
    DiffViewerComponent,
  ],
  templateUrl: './code-display.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CodeDisplayComponent {
  protected readonly tsCode = `import { Component, signal } from '@angular/core';

@Component({
  selector: 'mm-counter',
  template: \`
    <button (click)="increment()">
      Count: {{ count() }}
    </button>
  \`,
})
export class CounterComponent {
  // Signal con estado local
  protected readonly count = signal(0);

  protected increment(): void {
    this.count.update((c) => c + 1);
  }
}`;

  protected readonly htmlCode = `<div class="space-y-4">
  <h1 class="font-display text-3xl">Bienvenido</h1>
  <p class="text-ink-secondary">
    Galería de componentes premium.
  </p>
  <button type="button" class="rounded-mm-md bg-cta px-5 py-2">
    Empezar
  </button>
</div>`;

  protected readonly cssCode = `@theme inline {
  --color-brand-6: #1456f0;
  --color-brand-pink: #ea5ec1;
  --radius-mm-md: 8px;
  --shadow-mm-brand: 0 0 15px rgba(44, 30, 116, 0.16);
}

.mm-hover-lift {
  transition: transform 300ms var(--ease-out);
}

.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated) !important;
}`;

  protected readonly jsonCode = `{
  "name": "MinimalMax-base",
  "version": "0.1.0",
  "dependencies": {
    "@angular/core": "^21.2.0",
    "@angular/cdk": "^21.2.11"
  },
  "scripts": {
    "start": "ng serve",
    "build": "ng build"
  },
  "private": true
}`;

  protected readonly bashCode = `# Arrancar un proyecto nuevo desde MinimalMax base
xcopy /E /I C:\\Viernes\\starter-kit\\MinimalMax-base d:\\01_Proyectos\\mi-proyecto
cd d:\\01_Proyectos\\mi-proyecto
npm install
npm start`;

  protected readonly diffBefore = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

  protected readonly diffAfter = `function calculateTotal(items) {
  return items
    .filter((item) => item.active)
    .reduce((sum, item) => sum + item.price, 0);
}`;

  protected readonly snippetsCodeBlockTs: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-code-block [code]="tsCode" lang="ts" title="counter.component.ts" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `import { CodeBlockComponent } from '../../shared/components/code-block/code-block';

@Component({
  imports: [CodeBlockComponent],
  templateUrl: './code-display.html',
})
export class CodeDisplayComponent {
  // El template string del code-block (highlight regex sin libs externas)
  protected readonly tsCode = \`import { Component, signal } from '@angular/core';

@Component({
  selector: 'mm-counter',
  template: \\\`<button (click)="increment()">Count: {{ count() }}</button>\\\`,
})
export class CounterComponent {
  protected readonly count = signal(0);
  protected increment(): void { this.count.update((c) => c + 1); }
}\`;
}`,
    },
  ];

  protected readonly snippetsCodeBlockHtml: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-code-block [code]="htmlCode" lang="html" title="hero.html" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `protected readonly htmlCode = \`<div class="space-y-4">
  <h1 class="font-display text-3xl">Bienvenido</h1>
  <p class="text-ink-secondary">Galería de componentes premium.</p>
  <button type="button" class="rounded-mm-md bg-cta px-5 py-2">Empezar</button>
</div>\`;`,
    },
  ];

  protected readonly snippetsCodeBlockCss: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-code-block [code]="cssCode" lang="css" title="styles.css" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `protected readonly cssCode = \`@theme inline {
  --color-brand-6: #1456f0;
  --color-brand-pink: #ea5ec1;
  --radius-mm-md: 8px;
  --shadow-mm-brand: 0 0 15px rgba(44, 30, 116, 0.16);
}

.mm-hover-lift {
  transition: transform 300ms var(--ease-out);
}
.mm-hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-mm-elevated) !important;
}\`;`,
    },
  ];

  protected readonly snippetsCodeBlockJson: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-code-block [code]="jsonCode" lang="json" title="package.json" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `protected readonly jsonCode = \`{
  "name": "MinimalMax-base",
  "version": "0.1.0",
  "dependencies": {
    "@angular/core": "^21.2.0",
    "@angular/cdk": "^21.2.11"
  },
  "scripts": { "start": "ng serve", "build": "ng build" },
  "private": true
}\`;`,
    },
  ];

  protected readonly snippetsCodeBlockBash: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-code-block [code]="bashCode" lang="bash" title="setup.sh" />`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `protected readonly bashCode = \`# Arrancar un proyecto nuevo desde MinimalMax base
xcopy /E /I C:\\\\Viernes\\\\starter-kit\\\\MinimalMax-base d:\\\\01_Proyectos\\\\mi-proyecto
cd d:\\\\01_Proyectos\\\\mi-proyecto
npm install
npm start\`;`,
    },
  ];

  protected readonly snippetsDiffViewer: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'code-display.html',
      code: `<mm-diff-viewer
  [before]="diffBefore"
  [after]="diffAfter"
  title="src/utils/calculate-total.ts"
/>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'code-display.ts',
      code: `import { DiffViewerComponent } from '../../shared/components/diff-viewer/diff-viewer';

@Component({
  imports: [DiffViewerComponent],
  // ...
})
export class CodeDisplayComponent {
  protected readonly diffBefore = \`function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}\`;

  protected readonly diffAfter = \`function calculateTotal(items) {
  return items
    .filter((item) => item.active)
    .reduce((sum, item) => sum + item.price, 0);
}\`;
}`,
    },
  ];
}
