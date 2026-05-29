import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../core/services/breadcrumb.service';
import { MobileNavService } from '@minimax/ui-angular';
import { ThemeService } from '@minimax/ui-angular';

@Component({
  selector: 'mm-topbar',
  imports: [RouterLink],
  templateUrl: './topbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
})
export class TopbarComponent implements AfterViewInit {
  protected readonly breadcrumb = inject(BreadcrumbService);
  protected readonly mobileNav = inject(MobileNavService);
  protected readonly theme = inject(ThemeService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly progress = signal(0);
  protected readonly scrolled = signal(false);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateProgress();
  }

  @HostListener('window:scroll')
  protected updateProgress(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const value = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    this.progress.set(value);
    this.scrolled.set(scrollTop > 4);
  }
}
