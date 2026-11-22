import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  selector: 'app-hero-slider',
  imports: [FaIconComponent, SearchBar],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css',
})
export class HeroSlider implements OnInit, OnDestroy {
  private readonly movieService = inject(MovieService);
  private readonly router = inject(Router);

  faChevronLeft = faChevronLeft;
  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faStar = faStar;

  current = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  // 5 premiers films qui ont une image de fond
  slides = computed(() =>
    this.movieService.movieList().filter((m) => m.backdrop_path).slice(0, 5)
  );

  ngOnInit() {
    this.startAutoPlay();
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  next() {
    const total = this.slides().length;
    if (total) this.current.update((i) => (i + 1) % total);
  }

  prev() {
    const total = this.slides().length;
    if (total) this.current.update((i) => (i - 1 + total) % total);
  }

  goTo(index: number) {
    this.current.set(index);
    this.startAutoPlay(); // relance le timer après un clic
  }

  onArrow(direction: 'prev' | 'next') {
    direction === 'prev' ? this.prev() : this.next();
    this.startAutoPlay();
  }

  private startAutoPlay() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), 5000);
  }

  openMovie(movie: Movie) {
    this.movieService.selectedMovie.set(movie);
    this.router.navigate(['/', movie.id]); // adapte à ta route
  }

  scrollToList() {
    document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' });
  }
}