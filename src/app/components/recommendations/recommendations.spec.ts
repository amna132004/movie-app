import { Component, computed, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { Movie } from '../../interfaces/movie';

interface Mood {
  name: string;
  genres: number[]; // IDs de genres TMDB
}

@Component({
  imports: [],
  selector: 'app-recommendations',
  styleUrl: './recommendations.css',
  templateUrl: './recommendations.html',
})
export class Recommendations {
  movieService = inject(MovieService);
  private router = inject(Router);

  moods: Mood[] = [
    { name: 'Feel-good', genres: [35, 10751] },     // Comedy, Family
    { name: 'Thriller night', genres: [53, 80] },   // Thriller, Crime
    { name: 'Date night', genres: [10749, 35] },    // Romance, Comedy
    { name: 'Mind-bending', genres: [878, 9648] },  // Sci-Fi, Mystery
    { name: 'Adrenaline', genres: [28, 12] },       // Action, Adventure
  ];

  selectedMood = signal<Mood>(this.moods[0]);
  display = signal('What should I watch tonight?');
  result = signal<Movie | null>(null);
  spinning = signal(false);
  error = signal('');

  isInWish = computed(() =>
    this.movieService.wishList().some(m => m.id === this.result()?.id)
  );

  selectMood(mood: Mood) {
    if (this.spinning()) return;
    this.selectedMood.set(mood);
    this.result.set(null);
    this.error.set('');
    this.display.set('What should I watch tonight?');
  }

  spin() {
    if (this.spinning()) return;
    this.spinning.set(true);
    this.result.set(null);
    this.error.set('');

    const page = Math.floor(Math.random() * 5) + 1; // page 1 à 5 au hasard
    this.movieService.discoverByGenres(this.selectedMood().genres, page).subscribe({
      next: movies => {
        const list = movies.filter(m => m.poster_path);
        if (list.length === 0) {
          this.fail();
        } else {
          this.roll(list);
        }
      },
      error: () => this.fail(),
    });
  }

  // animation : les titres défilent de plus en plus lentement puis s'arrêtent
  private roll(list: Movie[]) {
    const winner = list[Math.floor(Math.random() * list.length)];
    const total = 22;
    let step = 0;
    let delay = 60;

    const tick = () => {
      this.display.set(list[step % list.length].title);
      step++;
      if (step < total) {
        delay += step > 14 ? 28 : 2;
        setTimeout(tick, delay);
      } else {
        this.display.set(winner.title);
        this.result.set(winner);
        this.spinning.set(false);
      }
    };
    tick();
  }

  private fail() {
    this.error.set("Couldn't load movies. Try again.");
    this.spinning.set(false);
  }

  viewDetails(movie: Movie) {
    this.close();
    this.router.navigate(['/', movie.id]);
  }

  addToWish(movie: Movie) {
    this.movieService.addToWish(movie);
  }

  @HostListener('document:keydown.escape')
  close() {
    this.movieService.showRecommendations.set(false);
  }
}