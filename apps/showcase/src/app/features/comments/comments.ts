import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CanvasFrameComponent,
  CanvasFrameSnippet,
} from '../../shared/components/canvas-frame/canvas-frame';
import { SectionHeaderComponent } from '@minimax/ui-angular';
import { RippleDirective } from '@minimax/ui-angular';
import { ToastService } from '@minimax/ui-angular';

interface User {
  readonly id: string;
  readonly name: string;
  readonly handle: string;
  readonly initials: string;
  readonly tone: string;
  readonly role?: string;
}

interface Reaction {
  readonly emoji: string;
  count: number;
  reacted: boolean;
}

interface Comment {
  readonly id: string;
  readonly author: User;
  body: string;
  readonly createdAt: string;
  edited: boolean;
  deleted: boolean;
  resolved: boolean;
  reactions: Reaction[];
  replies: Comment[];
}

interface ThreadSummary {
  readonly id: string;
  readonly title: string;
  readonly snippet: string;
  readonly participants: readonly User[];
  readonly replies: number;
  readonly resolved: boolean;
  readonly lastActivity: string;
  readonly reactionsTotal: number;
}

const EMOJI_PALETTE = ['👍', '❤️', '🚀', '🎉', '👀', '🤔'] as const;

@Component({
  selector: 'mm-comments',
  imports: [CanvasFrameComponent, SectionHeaderComponent, RippleDirective],
  templateUrl: './comments.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block' },
})
export class CommentsComponent {
  private readonly toast = inject(ToastService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly composerRef = viewChild<ElementRef<HTMLTextAreaElement>>('composerEl');

  protected readonly emojiPalette = EMOJI_PALETTE;

  protected readonly currentUser: User = {
    id: 'u-orbe',
    name: 'Orbelin Jimenez',
    handle: 'orbe',
    initials: 'OJ',
    tone: 'from-brand-6 to-brand-pink',
    role: 'Arquitecto',
  };

  protected readonly mentionableUsers: readonly User[] = [
    {
      id: 'u-sofia',
      name: 'Sofia Reyes',
      handle: 'sofia',
      initials: 'SR',
      tone: 'from-brand-pink to-fuchsia-500',
      role: 'Senior Designer',
    },
    {
      id: 'u-diego',
      name: 'Diego Luna',
      handle: 'diego',
      initials: 'DL',
      tone: 'from-emerald-500 to-teal-500',
      role: 'Backend Lead',
    },
    {
      id: 'u-ana',
      name: 'Ana Vega',
      handle: 'ana',
      initials: 'AV',
      tone: 'from-amber-500 to-orange-500',
      role: 'Product Manager',
    },
    {
      id: 'u-karina',
      name: 'Karina Mendez',
      handle: 'karina',
      initials: 'KM',
      tone: 'from-violet-500 to-purple-600',
      role: 'CTO',
    },
    {
      id: 'u-luis',
      name: 'Luis Mora',
      handle: 'luis',
      initials: 'LM',
      tone: 'from-sky-500 to-blue-600',
      role: 'Lead Engineer',
    },
  ];

  protected readonly thread = signal<Comment[]>([
    {
      id: 'c-1',
      author: this.mentionableUsers[0],
      body: 'Hola equipo! Pasé el wireframe del onboarding por una segunda iteración. Creo que el paso 3 (goals selection) se siente denso visualmente — son 6 cards y la grid se ve como un menú. ¿Qué opinan de reducir a 4 categorías principales con sub-tags?',
      createdAt: 'Hace 2 horas',
      edited: false,
      deleted: false,
      resolved: false,
      reactions: [
        { emoji: '👍', count: 3, reacted: true },
        { emoji: '🤔', count: 1, reacted: false },
      ],
      replies: [
        {
          id: 'c-1-1',
          author: this.mentionableUsers[1],
          body: 'Estoy de acuerdo. @ana ¿podemos revisar si las 6 categorías vienen de research o las inventamos nosotros?',
          createdAt: 'Hace 1 hora',
          edited: false,
          deleted: false,
          resolved: false,
          reactions: [{ emoji: '❤️', count: 2, reacted: false }],
          replies: [],
        },
        {
          id: 'c-1-2',
          author: this.mentionableUsers[2],
          body: '@diego buena observación. Salieron del workshop de febrero pero podemos hacer card sorting con 5 usuarios la próxima semana para validar.',
          createdAt: 'Hace 32 min',
          edited: true,
          deleted: false,
          resolved: false,
          reactions: [{ emoji: '🚀', count: 4, reacted: true }],
          replies: [],
        },
      ],
    },
    {
      id: 'c-2',
      author: this.mentionableUsers[3],
      body: 'Aprovechando — el step 5 (personalize) usa "Densidad: compact" pero no se aplica visualmente al preview. Eso confunde. O lo aplicamos o lo quitamos.',
      createdAt: 'Hace 45 min',
      edited: false,
      deleted: false,
      resolved: true,
      reactions: [{ emoji: '👍', count: 5, reacted: true }],
      replies: [],
    },
  ]);

  protected readonly composer = signal('');
  protected readonly mentionQuery = signal<string | null>(null);
  protected readonly editing = signal<string | null>(null);
  protected readonly replyingTo = signal<string | null>(null);

  protected readonly mentionMatches = computed(() => {
    const q = this.mentionQuery();
    if (q === null) return [];
    const lower = q.toLowerCase();
    return this.mentionableUsers
      .filter((u) => u.handle.toLowerCase().includes(lower) || u.name.toLowerCase().includes(lower))
      .slice(0, 5);
  });

  protected readonly totalComments = computed(() => {
    let count = 0;
    for (const c of this.thread()) {
      if (!c.deleted) count++;
      for (const r of c.replies) if (!r.deleted) count++;
    }
    return count;
  });

  protected readonly threadSummaries: readonly ThreadSummary[] = [
    {
      id: 't-1',
      title: 'Onboarding flow — review del paso 3',
      snippet: 'Hola equipo! Pasé el wireframe del onboarding por una segunda iteración…',
      participants: [this.mentionableUsers[0], this.mentionableUsers[1], this.mentionableUsers[2]],
      replies: 12,
      resolved: false,
      lastActivity: 'Hace 32 min',
      reactionsTotal: 10,
    },
    {
      id: 't-2',
      title: 'Tipografía display — Outfit vs DM Sans',
      snippet:
        'Estoy probando Outfit como display y DM Sans como UI. La proporción entre weights se siente…',
      participants: [this.mentionableUsers[0], this.mentionableUsers[3]],
      replies: 7,
      resolved: true,
      lastActivity: 'Hace 2 horas',
      reactionsTotal: 6,
    },
    {
      id: 't-3',
      title: 'Migración Postgres 16 — ventana de maintenance',
      snippet: 'Te paso el checklist actualizado con los puntos que validamos ayer…',
      participants: [this.mentionableUsers[1], this.mentionableUsers[3], this.mentionableUsers[4]],
      replies: 23,
      resolved: false,
      lastActivity: 'Ayer',
      reactionsTotal: 18,
    },
    {
      id: 't-4',
      title: 'Dark mode tokens — qué se invierte y qué no',
      snippet: 'Por qué llamar a un token "ink-charcoal" rompe tu dark mode y cómo nombrarlos…',
      participants: [this.mentionableUsers[2]],
      replies: 4,
      resolved: false,
      lastActivity: 'Hace 3 días',
      reactionsTotal: 12,
    },
  ];

  protected onComposerInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    const value = target.value;
    this.composer.set(value);

    const caret = target.selectionStart;
    const upToCaret = value.slice(0, caret);
    const match = upToCaret.match(/@([a-zA-Z0-9_]*)$/);
    if (match) {
      this.mentionQuery.set(match[1]);
    } else {
      this.mentionQuery.set(null);
    }
  }

  protected insertMention(user: User): void {
    const el = this.composerRef()?.nativeElement;
    if (!el) return;
    const value = this.composer();
    const caret = el.selectionStart;
    const upToCaret = value.slice(0, caret);
    const replaced = upToCaret.replace(/@([a-zA-Z0-9_]*)$/, `@${user.handle} `);
    const after = value.slice(caret);
    const next = replaced + after;
    this.composer.set(next);
    this.mentionQuery.set(null);

    queueMicrotask(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      el.focus();
      const pos = replaced.length;
      el.setSelectionRange(pos, pos);
    });
  }

  protected publish(): void {
    const text = this.composer().trim();
    if (!text) return;

    const replyId = this.replyingTo();
    if (replyId) {
      this.thread.update((list) =>
        list.map((c) =>
          c.id === replyId
            ? {
                ...c,
                replies: [
                  ...c.replies,
                  {
                    id: `c-${Date.now()}`,
                    author: this.currentUser,
                    body: text,
                    createdAt: 'Justo ahora',
                    edited: false,
                    deleted: false,
                    resolved: false,
                    reactions: [],
                    replies: [],
                  },
                ],
              }
            : c,
        ),
      );
      this.replyingTo.set(null);
      this.toast.success('Respuesta publicada');
    } else {
      this.thread.update((list) => [
        ...list,
        {
          id: `c-${Date.now()}`,
          author: this.currentUser,
          body: text,
          createdAt: 'Justo ahora',
          edited: false,
          deleted: false,
          resolved: false,
          reactions: [],
          replies: [],
        },
      ]);
      this.toast.success('Comentario publicado');
    }
    this.composer.set('');
    this.mentionQuery.set(null);
  }

  protected startReply(id: string): void {
    this.replyingTo.set(id);
    queueMicrotask(() => {
      if (!isPlatformBrowser(this.platformId)) return;
      this.composerRef()?.nativeElement.focus();
    });
  }

  protected cancelReply(): void {
    this.replyingTo.set(null);
  }

  protected toggleReaction(commentId: string, emoji: string, parentId?: string): void {
    this.thread.update((list) =>
      list.map((c) => {
        if (parentId && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, reactions: this.flipReaction(r.reactions, emoji) } : r,
            ),
          };
        }
        if (!parentId && c.id === commentId) {
          return { ...c, reactions: this.flipReaction(c.reactions, emoji) };
        }
        return c;
      }),
    );
  }

  private flipReaction(reactions: Reaction[], emoji: string): Reaction[] {
    const existing = reactions.find((r) => r.emoji === emoji);
    if (existing) {
      const nextCount = existing.count + (existing.reacted ? -1 : 1);
      if (nextCount <= 0) return reactions.filter((r) => r.emoji !== emoji);
      return reactions.map((r) =>
        r.emoji === emoji ? { ...r, count: nextCount, reacted: !r.reacted } : r,
      );
    }
    return [...reactions, { emoji, count: 1, reacted: true }];
  }

  protected resolveThread(commentId: string): void {
    this.thread.update((list) =>
      list.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c)),
    );
    this.toast.info('Estado del hilo actualizado');
  }

  protected deleteComment(commentId: string, parentId?: string): void {
    this.thread.update((list) =>
      list.map((c) => {
        if (parentId && c.id === parentId) {
          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === commentId ? { ...r, deleted: true, body: '[mensaje eliminado]' } : r,
            ),
          };
        }
        if (!parentId && c.id === commentId) {
          return { ...c, deleted: true, body: '[mensaje eliminado]' };
        }
        return c;
      }),
    );
    this.toast.info('Comentario eliminado');
  }

  protected renderBody(text: string): string {
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return escaped.replace(
      /@([a-zA-Z0-9_]+)/g,
      '<span class="rounded-mm-sm bg-primary-200 text-primary-700 px-1 py-0.5 text-[0.85em] font-medium">@$1</span>',
    );
  }

  protected readonly snippetsThread: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'comments.html (extracto)',
      code: `<!-- Hilo principal con threading 2 niveles -->
<ol class="flex flex-col gap-4">
  @for (comment of thread(); track comment.id) {
    <li class="rounded-mm-2xl border border-border-soft bg-surface-base p-4 shadow-mm-sm">

      <!-- Avatar + autor + metadata -->
      <header class="flex items-start gap-3">
        <span [class]="'size-9 rounded-mm-pill bg-linear-to-br ' + comment.author.tone">
          {{ comment.author.initials }}
        </span>
        <div class="flex-1">
          <p class="font-medium">{{ comment.author.name }}</p>
          <p class="text-xs text-ink-muted">
            {{ comment.createdAt }}
            @if (comment.edited) { · <span class="italic">editado</span> }
          </p>
        </div>
        @if (comment.resolved) {
          <span class="rounded-mm-pill bg-success-bg text-success px-2 py-0.5 text-[10px]">
            Resuelto
          </span>
        }
      </header>

      <!-- Body con mentions rendered -->
      <p [innerHTML]="renderBody(comment.body)" class="text-sm mt-2"></p>

      <!-- Reactions row -->
      <div class="flex items-center gap-1.5 mt-3 flex-wrap">
        @for (r of comment.reactions; track r.emoji) {
          <button (click)="toggleReaction(comment.id, r.emoji)"
                  [class.bg-primary-200]="r.reacted"
                  [class.text-primary-700]="r.reacted"
                  class="rounded-mm-pill px-2.5 py-1 text-xs">
            {{ r.emoji }} {{ r.count }}
          </button>
        }
        <!-- Botón "+" para agregar reacción -->
        <button class="size-7 rounded-mm-pill"><svg><!-- smile --></svg></button>
      </div>

      <!-- Replies anidadas (1 nivel adentro) -->
      @if (comment.replies.length > 0) {
        <ol class="mt-3 ml-12 flex flex-col gap-3 border-l-2 border-border-soft pl-4">
          @for (reply of comment.replies; track reply.id) {
            <li><!-- estructura igual al parent --></li>
          }
        </ol>
      }
    </li>
  }
</ol>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'comments.ts (interfaces + signals)',
      code: `interface User {
  readonly id: string;
  readonly name: string;
  readonly handle: string;       // sin @ ej "sofia"
  readonly initials: string;
  readonly tone: string;          // tailwind gradient classes
  readonly role?: string;
}

interface Reaction {
  readonly emoji: string;
  count: number;
  reacted: boolean;               // si el usuario actual ya reaccionó
}

interface Comment {
  readonly id: string;
  readonly author: User;
  body: string;
  readonly createdAt: string;
  edited: boolean;
  deleted: boolean;
  resolved: boolean;
  reactions: Reaction[];
  replies: Comment[];             // 1 nivel de anidación
}

protected readonly thread = signal<Comment[]>([...]);

// Toggle reaction (flip)
private flipReaction(reactions: Reaction[], emoji: string): Reaction[] {
  const existing = reactions.find((r) => r.emoji === emoji);
  if (existing) {
    const nextCount = existing.count + (existing.reacted ? -1 : 1);
    if (nextCount <= 0) return reactions.filter((r) => r.emoji !== emoji);
    return reactions.map((r) =>
      r.emoji === emoji ? { ...r, count: nextCount, reacted: !r.reacted } : r,
    );
  }
  return [...reactions, { emoji, count: 1, reacted: true }];
}

// Render body con mentions destacadas
protected renderBody(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // @handle → pill coloreado
  return escaped.replace(
    /@([a-zA-Z0-9_]+)/g,
    '<span class="rounded-mm-sm bg-primary-200 text-primary-700 px-1 py-0.5 text-[0.85em] font-medium">@$1</span>',
  );
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — animaciones del hilo',
      code: `/* fadeInUp — entrada suave hacia arriba */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* fadeInDown — entrada desde arriba (banners/popups) */
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-12px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    },
  ];

  protected readonly snippetsComposer: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'composer.html',
      code: `<!-- Composer con textarea + mention popup -->
<div class="relative">
  <textarea
    #composer
    [value]="composer()"
    (input)="onComposerInput($event)"
    placeholder="Escribe un comentario… (@ para mencionar)"
    class="mm-input-bare w-full rounded-mm-2xl border bg-surface-base p-4 resize-none
           focus:border-brand-6 focus:shadow-mm-brand transition"
    rows="3"
  ></textarea>

  <!-- Mention popup (aparece cuando hay match) -->
  @if (mentionMatches().length > 0) {
    <ul class="absolute bottom-full mb-2 left-0 z-10 rounded-mm-xl border bg-surface-base
               shadow-mm-elevated p-1 min-w-64"
        style="animation: fadeInUp 220ms var(--ease-out) both;">
      @for (user of mentionMatches(); track user.id) {
        <li>
          <button (click)="insertMention(user)"
                  class="w-full flex items-center gap-3 p-2 rounded-mm-md
                         hover:bg-surface-secondary text-left">
            <span [class]="'size-8 rounded-mm-pill bg-linear-to-br ' + user.tone">
              {{ user.initials }}
            </span>
            <div>
              <p class="font-medium">{{ user.name }}</p>
              <p class="text-xs text-ink-muted">{{ '@' }}{{ user.handle }} · {{ user.role }}</p>
            </div>
          </button>
        </li>
      }
    </ul>
  }

  <!-- Footer del composer: emoji picker + submit -->
  <div class="flex items-center justify-between p-2 border-t">
    <button class="rounded-mm-md p-2"><svg><!-- emoji --></svg></button>
    <button (click)="publish()" [disabled]="!composer().trim()"
            class="rounded-mm-pill bg-cta text-cta-fg px-4 py-1.5">
      Comentar
    </button>
  </div>
</div>`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'mention parsing',
      code: `protected readonly composer = signal('');
protected readonly mentionQuery = signal<string | null>(null);

// Cada input parsea la última palabra antes del caret. Si empieza con @
// abre el popup con los matches.
protected onComposerInput(event: Event): void {
  const target = event.target as HTMLTextAreaElement;
  const value = target.value;
  this.composer.set(value);

  const caret = target.selectionStart;
  const upToCaret = value.slice(0, caret);
  const match = upToCaret.match(/@([a-zA-Z0-9_]*)$/);
  if (match) {
    this.mentionQuery.set(match[1]);    // ej "sof" si tipeaste "@sof"
  } else {
    this.mentionQuery.set(null);
  }
}

protected readonly mentionMatches = computed(() => {
  const q = this.mentionQuery();
  if (q === null) return [];
  return this.mentionableUsers
    .filter((u) => u.handle.includes(q.toLowerCase()) || u.name.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 5);
});

// Al seleccionar un usuario del popup, reemplaza @xyz por @handle + espacio
protected insertMention(user: User): void {
  const el = this.composerRef()?.nativeElement;
  if (!el) return;
  const value = this.composer();
  const caret = el.selectionStart;
  const upToCaret = value.slice(0, caret);
  const replaced = upToCaret.replace(/@([a-zA-Z0-9_]*)$/, \`@\${user.handle} \`);
  const after = value.slice(caret);
  this.composer.set(replaced + after);
  this.mentionQuery.set(null);

  queueMicrotask(() => {
    el.focus();
    const pos = replaced.length;
    el.setSelectionRange(pos, pos);
  });
}`,
    },
    {
      label: 'CSS',
      lang: 'css',
      title: 'styles.css — fadeInUp',
      code: `/* fadeInUp — entrada suave hacia arriba */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}`,
    },
  ];

  protected readonly snippetsStates: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'comment-states.html',
      code: `<!-- Estados visuales de un comentario -->

<!-- 1. Edited badge inline -->
<p class="text-xs text-ink-muted">
  {{ comment.createdAt }}
  @if (comment.edited) {
    · <span class="italic">editado</span>
  }
</p>

<!-- 2. Resolved (todo el hilo) — borde verde + badge -->
<li class="rounded-mm-2xl border bg-surface-base p-4"
    [class.border-success]="comment.resolved"
    [class.bg-success-bg/30]="comment.resolved">
  @if (comment.resolved) {
    <span class="inline-flex items-center gap-1.5 rounded-mm-pill
                 bg-success-bg text-success px-2 py-0.5 text-[10px] font-semibold">
      <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
        <path d="M20 6 9 17l-5-5"/>
      </svg>
      Resuelto
    </span>
  }
</li>

<!-- 3. Deleted (soft delete: muestra placeholder pero mantiene threading) -->
@if (comment.deleted) {
  <p class="text-xs text-ink-muted italic">[mensaje eliminado]</p>
} @else {
  <p [innerHTML]="renderBody(comment.body)"></p>
}`,
    },
    {
      label: 'TS',
      lang: 'ts',
      title: 'state mutators',
      code: `// Resolve toggle (boolean flip)
protected resolveThread(commentId: string): void {
  this.thread.update((list) =>
    list.map((c) => (c.id === commentId ? { ...c, resolved: !c.resolved } : c)),
  );
}

// Soft delete: no quita del array, marca \`deleted: true\` para conservar threading
protected deleteComment(commentId: string, parentId?: string): void {
  this.thread.update((list) =>
    list.map((c) => {
      if (parentId && c.id === parentId) {
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId
              ? { ...r, deleted: true, body: '[mensaje eliminado]' }
              : r,
          ),
        };
      }
      if (!parentId && c.id === commentId) {
        return { ...c, deleted: true, body: '[mensaje eliminado]' };
      }
      return c;
    }),
  );
}`,
    },
  ];

  protected readonly snippetsSummary: readonly CanvasFrameSnippet[] = [
    {
      label: 'HTML',
      lang: 'html',
      title: 'thread-summary-list.html',
      code: `<ul data-stagger class="flex flex-col gap-2">
  @for (t of threadSummaries; track t.id) {
    <li>
      <button class="group w-full flex items-start gap-3 rounded-mm-xl border bg-surface-base
                     p-4 text-left shadow-mm-sm hover:shadow-mm-elevated hover:border-brand-6">

        <!-- Avatar stack de participantes (overlap) -->
        <div class="flex items-center shrink-0">
          @for (p of t.participants; track p.id; let i = $index) {
            <span [class]="'relative size-9 rounded-mm-pill bg-linear-to-br ring-2 ring-surface-base ' + p.tone"
                  [style.margin-left.px]="i === 0 ? 0 : -10"
                  [style.z-index]="t.participants.length - i">
              {{ p.initials }}
            </span>
          }
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h4 class="font-medium text-sm truncate">{{ t.title }}</h4>
            @if (t.resolved) {
              <span class="rounded-mm-pill bg-success-bg text-success px-2 py-0.5 text-[10px]">
                Resuelto
              </span>
            }
          </div>
          <p class="text-xs text-ink-muted line-clamp-2">{{ t.snippet }}</p>

          <!-- Footer con stats -->
          <div class="flex items-center gap-3 mt-2 text-[11px] text-ink-muted">
            <span>💬 {{ t.replies }}</span>
            <span>✨ {{ t.reactionsTotal }}</span>
            <span class="font-mono">{{ t.lastActivity }}</span>
          </div>
        </div>
      </button>
    </li>
  }
</ul>`,
    },
  ];
}
