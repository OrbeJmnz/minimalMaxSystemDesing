import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';

interface MapLocation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly bbox: string;
  readonly marker: string;
}

@Component({
  selector: 'mm-maps',
  imports: [CanvasFrameComponent, SectionHeaderComponent],
  templateUrl: './maps.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class MapsComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly locations: readonly MapLocation[] = [
    {
      id: 'cdmx',
      name: 'Ciudad de México',
      description: 'Sede principal — Roma Norte, CDMX',
      bbox: '-99.1932,19.4126,-99.1532,19.4426',
      marker: '19.4276,-99.1732',
    },
    {
      id: 'cancun',
      name: 'Cancún',
      description: 'Oficina de operaciones turísticas',
      bbox: '-86.8456,21.1419,-86.7856,21.1819',
      marker: '21.1619,-86.8156',
    },
    {
      id: 'merida',
      name: 'Mérida',
      description: 'Centro de soporte yucateco',
      bbox: '-89.6437,20.9474,-89.5837,20.9874',
      marker: '20.9674,-89.6137',
    },
  ];

  protected readonly activeId = signal<string>(this.locations[0].id);

  protected readonly activeLocation = computed(
    () => this.locations.find((loc) => loc.id === this.activeId()) ?? this.locations[0],
  );

  protected readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.openstreetmap.org/export/embed.html?bbox=${this.activeLocation().bbox}&layer=mapnik&marker=${this.activeLocation().marker}`,
    ),
  );

  protected setLocation(id: string): void {
    this.activeId.set(id);
  }

  protected readonly snippetsMap: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'maps.html',
      code: `<!-- Tabs con ubicaciones -->
<nav class="inline-flex flex-wrap items-center gap-2 p-1
            bg-surface-secondary rounded-mm-pill self-start" role="tablist">
  @for (loc of locations; track loc.id) {
    <button
      type="button"
      role="tab"
      (click)="setLocation(loc.id)"
      class="rounded-mm-pill px-4 py-1.5 text-xs font-medium transition-colors"
      [class.bg-cta]="activeId() === loc.id"
      [class.text-white]="activeId() === loc.id"
      [class.shadow-mm-sm]="activeId() === loc.id"
    >
      {{ loc.name }}
    </button>
  }
</nav>

<!-- Iframe con SafeResourceUrl + overlay con info de la ubicación -->
<div class="rounded-mm-2xl overflow-hidden border border-border-soft
            shadow-mm-sm relative">
  <iframe
    [src]="mapUrl()"
    class="w-full aspect-video block bg-surface-secondary"
    loading="lazy"
    [attr.title]="'Mapa de ' + activeLocation().name"
  ></iframe>

  <div class="absolute top-4 left-4 max-w-xs rounded-mm-xl bg-surface-base/95
              backdrop-blur-md border border-border-soft shadow-mm-elevated p-4">
    <span class="text-[10px] uppercase tracking-wider text-ink-muted font-semibold">
      Ubicación activa
    </span>
    <h4 class="font-display text-base font-semibold text-ink-dark mt-0.5">
      {{ activeLocation().name }}
    </h4>
    <p class="text-xs text-ink-secondary mt-1">{{ activeLocation().description }}</p>
    <p class="mt-3 font-mono text-[10px] text-ink-muted">
      {{ activeLocation().marker }}
    </p>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'maps.ts',
      code: `import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface MapLocation {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly bbox: string;     // "minLon,minLat,maxLon,maxLat"
  readonly marker: string;   // "lat,lon"
}

@Component({
  selector: 'mm-maps',
  templateUrl: './maps.html',
})
export class MapsComponent {
  private readonly sanitizer = inject(DomSanitizer);

  protected readonly locations: readonly MapLocation[] = [
    {
      id: 'cdmx',
      name: 'Ciudad de México',
      description: 'Sede principal — Roma Norte, CDMX',
      bbox: '-99.1932,19.4126,-99.1532,19.4426',
      marker: '19.4276,-99.1732',
    },
    {
      id: 'cancun',
      name: 'Cancún',
      description: 'Oficina de operaciones turísticas',
      bbox: '-86.8456,21.1419,-86.7856,21.1819',
      marker: '21.1619,-86.8156',
    },
    {
      id: 'merida',
      name: 'Mérida',
      description: 'Centro de soporte yucateco',
      bbox: '-89.6437,20.9474,-89.5837,20.9874',
      marker: '20.9674,-89.6137',
    },
  ];

  protected readonly activeId = signal<string>(this.locations[0].id);

  protected readonly activeLocation = computed(
    () => this.locations.find((l) => l.id === this.activeId()) ?? this.locations[0],
  );

  // Cicatriz #8 — iframe con src dinámico necesita DomSanitizer.
  protected readonly mapUrl = computed<SafeResourceUrl>(() =>
    this.sanitizer.bypassSecurityTrustResourceUrl(
      \`https://www.openstreetmap.org/export/embed.html\` +
      \`?bbox=\${this.activeLocation().bbox}\` +
      \`&layer=mapnik&marker=\${this.activeLocation().marker}\`,
    ),
  );

  protected setLocation(id: string): void {
    this.activeId.set(id);
  }
}`,
    },
  ];

  protected readonly snippetsLeaflet: readonly CanvasFrameSnippet[] = [
    {
      label: 'TS',
      lang: 'ts',
      title: 'Patrón Leaflet (producción)',
      code: `// npm i leaflet @asymmetrik/ngx-leaflet
// styles.css → @import "leaflet/dist/leaflet.css";

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import * as L from 'leaflet';

@Component({
  imports: [LeafletModule],
  template: \`
    <div leaflet
      [leafletOptions]="options"
      [leafletLayers]="markers"
      class="rounded-mm-2xl overflow-hidden aspect-video">
    </div>
  \`,
})
export class MapDemo {
  protected options: L.MapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap',
      }),
    ],
    zoom: 12,
    center: L.latLng(19.4326, -99.1332),
  };

  protected markers = [
    L.marker([19.4326, -99.1332]).bindPopup('CDMX HQ'),
    L.marker([21.1619, -86.8156]).bindPopup('Cancún'),
  ];
}`,
    },
  ];
}
