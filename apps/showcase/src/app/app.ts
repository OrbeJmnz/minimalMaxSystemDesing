import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar';
import { TopbarComponent } from './shared/components/topbar/topbar';
import { TocComponent } from './shared/components/toc/toc';
import { RouteLoaderComponent } from './shared/components/route-loader/route-loader';
import { ToastHostComponent, TourHostComponent } from '@minimax/ui-angular';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SidebarComponent,
    TopbarComponent,
    TocComponent,
    ToastHostComponent,
    RouteLoaderComponent,
    TourHostComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
