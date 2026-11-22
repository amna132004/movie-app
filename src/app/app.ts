import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeadBar } from './components/head-bar/head-bar';
import { Footer } from './components/footer/footer';
import { Recommendations } from './components/recommendations/recommendations';

@Component({
  imports: [ HeadBar, RouterOutlet, Footer, Recommendations ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('movie-app');
}
