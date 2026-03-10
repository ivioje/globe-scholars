import {Component, signal} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Menu} from './shared/menu/menu';
import {BreadcrumbsComponent} from './shared/breadcrumbs-component/breadcrumbs-component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menu, BreadcrumbsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('globe-scholars');
}
