import { Component, inject } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { OnInit } from '@angular/core';
import { Movie } from '../../interfaces/movie';
import { Router } from '@angular/router';
import { SearchBar } from '../search-bar/search-bar';
import { HeroSlider } from '../hero-slider/hero-slider';

@Component({
  imports: [SearchBar, HeroSlider],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList implements OnInit {
  router= inject(Router)
  movieService= inject(MovieService)
  ngOnInit(): void {
  this.movieService.getMovieList().subscribe(Response => { this.movieService.movieList.set(Response);
    console.log(this.movieService.movieList)
   });
}

navigateTo(movie: Movie) {
  this.router.navigate(['/',movie.id])
}
}