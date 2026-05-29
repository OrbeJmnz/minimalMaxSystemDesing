import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';

interface FeedItem {
  readonly id: string;
  readonly author: { name: string; initials: string; tone: string };
  readonly verb: string;
  readonly target?: string;
  readonly content?: string;
  readonly attachment?: { type: 'image' | 'code'; src?: string; code?: string };
  readonly time: string;
  readonly reactions: { emoji: string; count: number; mine?: boolean }[];
  readonly commentsCount: number;
}

@Component({
  selector: 'mm-social',
  imports: [CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './social.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class SocialComponent {
  protected readonly newPost = signal<string>('');

  protected readonly feed = signal<FeedItem[]>([
    {
      id: 'f1',
      author: { name: 'Sofia Reyes', initials: 'SR', tone: 'from-brand-pink to-fuchsia-500' },
      verb: 'compartió un proyecto',
      target: 'MinimalMax Showcase v0.3',
      content:
        'Acabamos de cerrar 18 features con tokens semánticos + dark mode SSR-safe. El bundle inicial sigue en 75 KB. 🚀',
      attachment: {
        type: 'image',
        src: 'https://images.unsplash.com/photo-1532465614-6cc8d45f647f?w=800&q=70&auto=format&fit=crop',
      },
      time: 'Hace 5 min',
      reactions: [
        { emoji: '🔥', count: 12, mine: true },
        { emoji: '🎉', count: 8 },
        { emoji: '👏', count: 4 },
      ],
      commentsCount: 5,
    },
    {
      id: 'f2',
      author: { name: 'Diego Luna', initials: 'DL', tone: 'from-emerald-500 to-teal-500' },
      verb: 'desplegó',
      target: 'v0.3.2 a producción',
      content: '12 commits · 3 contributors · 0 hotfixes pendientes.',
      time: 'Hace 1 hora',
      reactions: [
        { emoji: '✅', count: 6 },
        { emoji: '🚀', count: 3 },
      ],
      commentsCount: 2,
    },
    {
      id: 'f3',
      author: { name: 'Ana Vega', initials: 'AV', tone: 'from-amber-500 to-orange-500' },
      verb: 'comentó en',
      target: 'PR #142 — Charts SVG',
      content: 'Probé en mobile y el heatmap se ve increíble con dark mode. Ship it 🎯',
      time: 'Hace 2 horas',
      reactions: [
        { emoji: '💯', count: 4 },
        { emoji: '👀', count: 2 },
      ],
      commentsCount: 1,
    },
    {
      id: 'f4',
      author: { name: 'Luis Mora', initials: 'LM', tone: 'from-violet-500 to-indigo-500' },
      verb: 'publicó un snippet',
      content: 'Patrón de focus trap manual sin @angular/cdk:',
      attachment: {
        type: 'code',
        code: `protected onTab(event: KeyboardEvent): void {
  const focusable = this.focusableElements();
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}`,
      },
      time: 'Hace 3 horas',
      reactions: [
        { emoji: '💡', count: 9 },
        { emoji: '🙏', count: 3 },
      ],
      commentsCount: 4,
    },
  ]);

  protected readonly emojiPicker = signal<string | null>(null);
  protected readonly availableEmojis = ['🔥', '🎉', '👏', '💯', '👀', '💡', '🙏', '✅', '🚀'];

  protected toggleReaction(itemId: string, emoji: string): void {
    this.feed.update((items) =>
      items.map((item) => {
        if (item.id !== itemId) return item;
        const existing = item.reactions.find((r) => r.emoji === emoji);
        if (!existing) {
          return {
            ...item,
            reactions: [...item.reactions, { emoji, count: 1, mine: true }],
          };
        }
        if (existing.mine) {
          const reactions = item.reactions
            .map((r) => (r.emoji === emoji ? { ...r, count: r.count - 1, mine: false } : r))
            .filter((r) => r.count > 0);
          return { ...item, reactions };
        }
        return {
          ...item,
          reactions: item.reactions.map((r) =>
            r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
          ),
        };
      }),
    );
    this.emojiPicker.set(null);
  }

  protected toggleEmojiPicker(itemId: string): void {
    this.emojiPicker.update((current) => (current === itemId ? null : itemId));
  }

  protected post(): void {
    const text = this.newPost().trim();
    if (!text) return;
    this.feed.update((items) => [
      {
        id: `f${Date.now()}`,
        author: { name: 'Tú', initials: 'OJ', tone: 'from-brand-6 to-primary-500' },
        verb: 'publicó',
        content: text,
        time: 'Justo ahora',
        reactions: [],
        commentsCount: 0,
      },
      ...items,
    ]);
    this.newPost.set('');
  }

  protected readonly snippetsComposeBox: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'compose-box.html',
      code: `<div class="rounded-mm-2xl border border-border-soft bg-surface-base p-4
            shadow-mm-sm flex gap-3">
  <!-- Avatar del usuario -->
  <span class="size-10 shrink-0 rounded-mm-pill grid place-items-center
               text-white font-display font-semibold text-sm
               bg-linear-to-br from-brand-6 to-primary-500">
    OJ
  </span>

  <div class="flex-1 flex flex-col gap-3">
    <textarea
      [value]="newPost()"
      (input)="newPost.set($any($event.target).value)"
      placeholder="¿Qué quieres compartir?"
      rows="2"
      class="w-full resize-none rounded-mm-md border border-border
             bg-surface-secondary/40 px-3 py-2 text-sm focus:bg-surface-base
             focus:border-primary-500 focus:ring-3 focus:ring-primary-500/10
             mm-scroll-thin"></textarea>

    <div class="flex items-center justify-between">
      <!-- Toolbar: imagen, código, emoji -->
      <div class="flex items-center gap-1 text-ink-muted">
        <button class="size-8 rounded-mm-sm hover:bg-surface-secondary mm-press">
          <!-- icono imagen -->
        </button>
        <!-- ... -->
      </div>

      <button mmRipple (click)="post()" [disabled]="!newPost().trim()"
              class="rounded-mm-md bg-cta px-4 py-2 text-xs font-medium
                     text-cta-fg shadow-mm-sm disabled:opacity-40
                     disabled:cursor-not-allowed mm-press">
        Publicar
      </button>
    </div>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'compose logic',
      code: `protected readonly newPost = signal<string>('');

protected post(): void {
  const text = this.newPost().trim();
  if (!text) return;

  // Prepend (más reciente arriba)
  this.feed.update((items) => [
    {
      id: \`f\${Date.now()}\`,
      author: { name: 'Tú', initials: 'OJ', tone: 'from-brand-6 to-primary-500' },
      verb: 'publicó',
      content: text,
      time: 'Justo ahora',
      reactions: [],
      commentsCount: 0,
    },
    ...items,
  ]);
  this.newPost.set('');
}`,
    },
  ];

  protected readonly snippetsFeedActividad: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'feed.html',
      code: `<ul data-stagger class="flex flex-col gap-4">
  @for (item of feed(); track item.id) {
    <li class="rounded-mm-2xl border border-border-soft bg-surface-base
               p-5 shadow-mm-sm">
      <!-- Header: avatar + verbo social + tiempo -->
      <header class="flex items-start gap-3 mb-3">
        <span [class]="'size-10 rounded-mm-pill grid place-items-center
                        text-white font-display font-semibold text-sm
                        bg-linear-to-br ' + item.author.tone">
          {{ item.author.initials }}
        </span>
        <div class="flex-1 min-w-0">
          <p class="text-sm leading-snug">
            <span class="font-medium text-ink-dark">{{ item.author.name }}</span>
            <span class="text-ink-secondary"> {{ item.verb }} </span>
            @if (item.target) {
              <a class="font-medium text-brand-6 hover:underline">
                {{ item.target }}
              </a>
            }
          </p>
          <p class="text-xs text-ink-muted font-mono mt-0.5">{{ item.time }}</p>
        </div>
      </header>

      <!-- Content + attachment (image | code) -->
      @if (item.content) {
        <p class="text-sm text-ink-dark leading-relaxed">{{ item.content }}</p>
      }
      @if (item.attachment?.type === 'image') {
        <img [src]="item.attachment!.src" loading="lazy"
             class="mt-3 rounded-mm-xl w-full max-h-72 object-cover" />
      } @else if (item.attachment?.type === 'code') {
        <pre class="mt-3 rounded-mm-xl bg-surface-inverse text-white/90
                    p-4 text-xs font-mono mm-scroll-thin"><code>{{
          item.attachment!.code
        }}</code></pre>
      }

      <!-- Footer: reactions + comments -->
      <footer class="flex items-center justify-between mt-4 pt-3
                     border-t border-border-soft">
        <div class="flex flex-wrap items-center gap-1.5">
          @for (r of item.reactions; track r.emoji) {
            <button (click)="toggleReaction(item.id, r.emoji)"
                    class="inline-flex items-center gap-1 rounded-mm-pill
                           px-2 py-0.5 text-xs mm-press"
                    [class.bg-primary-200]="r.mine"
                    [class.text-primary-700]="r.mine"
                    [class.bg-surface-secondary]="!r.mine">
              <span>{{ r.emoji }}</span>
              <span class="font-mono">{{ r.count }}</span>
            </button>
          }
          <!-- Picker de emoji con scaleIn -->
        </div>
        <button class="inline-flex items-center gap-1.5 text-xs text-ink-secondary">
          <!-- icono mensaje --> {{ item.commentsCount }}
        </button>
      </footer>
    </li>
  }
</ul>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'feed + reactions',
      code: `interface FeedItem {
  readonly id: string;
  readonly author: { name: string; initials: string; tone: string };
  readonly verb: string;
  readonly target?: string;
  readonly content?: string;
  readonly attachment?: { type: 'image' | 'code'; src?: string; code?: string };
  readonly time: string;
  readonly reactions: { emoji: string; count: number; mine?: boolean }[];
  readonly commentsCount: number;
}

protected readonly feed = signal<FeedItem[]>([
  {
    id: 'f1',
    author: { name: 'Sofia Reyes', initials: 'SR', tone: 'from-brand-pink to-fuchsia-500' },
    verb: 'compartió un proyecto',
    target: 'MinimalMax Showcase v0.3',
    content: 'Acabamos de cerrar 18 features con tokens semánticos...',
    attachment: { type: 'image', src: '...' },
    time: 'Hace 5 min',
    reactions: [
      { emoji: '🔥', count: 12, mine: true },
      { emoji: '🎉', count: 8 },
    ],
    commentsCount: 5,
  },
  // ... más items
]);

protected readonly availableEmojis = ['🔥', '🎉', '👏', '💯', '👀', '💡', '🙏', '✅', '🚀'];

// Toggle: si ya reaccioné, decrementa y filtra; si no, agrega o incrementa
protected toggleReaction(itemId: string, emoji: string): void {
  this.feed.update((items) =>
    items.map((item) => {
      if (item.id !== itemId) return item;
      const existing = item.reactions.find((r) => r.emoji === emoji);
      if (!existing) {
        return { ...item, reactions: [...item.reactions, { emoji, count: 1, mine: true }] };
      }
      if (existing.mine) {
        // Quitar mi reacción
        const reactions = item.reactions
          .map((r) => r.emoji === emoji ? { ...r, count: r.count - 1, mine: false } : r)
          .filter((r) => r.count > 0);
        return { ...item, reactions };
      }
      // Agregar mi reacción a una ya existente
      return {
        ...item,
        reactions: item.reactions.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, mine: true } : r,
        ),
      };
    }),
  );
  this.emojiPicker.set(null);
}`,
    },
  ];
}
