import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NavService } from '../../../core/services/nav.service';
import { MobileNavService } from '../../../core/services/mobile-nav.service';

@Component({
  selector: 'mm-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  protected readonly nav = inject(NavService);
  protected readonly mobileNav = inject(MobileNavService);
  private readonly router = inject(Router);

  protected onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.nav.setQuery(target.value);
  }

  protected onItemClick(): void {
    this.mobileNav.close();
  }

  protected goHome(): void {
    this.mobileNav.close();
    this.router.navigateByUrl('/overview');
  }
}
