import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faMoon, faSun, faDice } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { ThemeService } from '../../services/theme_service';
import { MovieService } from '../../services/movie-service';
@Component({
  imports: [FontAwesomeModule],
  selector: 'app-head-bar',
  styleUrl: './head-bar.css',
  templateUrl: './head-bar.html',
})
export class HeadBar {
  faHeart = faHeart
  faMoon = faMoon
  faSun = faSun
    faDice = faDice

  theme = inject(ThemeService)
  router =inject(Router)
    movieService = inject(MovieService)

  navigateToWishList() {
    this.router.navigate(['/wishlist'])
  }
    goHome() {
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  openRecommendations() {
    this.movieService.showRecommendations.set(true);
  }
}
