import { inject, Injectable, signal, computed } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, pipe, Observable } from 'rxjs';
import { Movie } from '../interfaces/movie';
import { MovieResponse } from '../interfaces/movie-response';
import { MovieList } from '../components/movie-list/movie-list';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class MovieService {

    private readonly http=inject(HttpClient)
    private readonly url=environment.url_api
    private readonly Key=environment.api_key
    private readonly movieUrl=environment.url_movie_api  
    private readonly discoverUrl = environment.url_discover_api;

    private router = inject(Router);
    public movieList= signal<Movie[]>([]) ;
    public selectedMovie=signal<Movie | null>(null);
public wishList = signal<Movie[]>(this.loadWishList());public sortBy = signal<string>('');

public showRecommendations = signal(false);


  // films filtrés par genres (OR) pour une page donnée
  discoverByGenres(genres: number[], page: number): Observable<Movie[]> {
    const ids = genres.join('%7C'); // "%7C" = "|" (genre A OU genre B)
    return this.http
      .get<MovieResponse>(
        `${this.discoverUrl}?api_key=${this.Key}&with_genres=${ids}&sort_by=popularity.desc&vote_count.gte=200&page=${page}`
      )
      .pipe(map(response => response.results));
  }

// liste triée, recalculée automatiquement quand movieList ou sortBy change
public sortedMovieList = computed(() => {
  const list = [...this.movieList()];

  switch (this.sortBy()) {
    case 'title-asc':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return list.sort((a, b) => b.title.localeCompare(a.title));
    case 'date-desc':
      return list.sort((a, b) => b.release_date.localeCompare(a.release_date));
    case 'date-asc':
      return list.sort((a, b) => a.release_date.localeCompare(b.release_date));
    default:
      return list;
  }
});
    getMovieList(): Observable<Movie[]>{
        return this.http.get<MovieResponse>( `${this.url}?api_key=${this.Key}`).pipe(
            map(response=> response.results)
        );
        
    }

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${this.movieUrl}/${id}?api_key=${this.Key}`).pipe(
            map(response => response)
        );
    }

    backToMovieList() {
    this.router.navigate(['/'])
  }
    addToWish(movie: Movie) {
    if (this.wishList().some(m => m.id === movie.id)) return; // pas de doublon
    this.wishList.update(wishList => [...wishList, movie]);
    this.saveWishList();
  }

  removeFromWish(id: number) {
    this.wishList.update(wishList => wishList.filter(m => m.id !== id));
    this.saveWishList();
  }

  private saveWishList() {
    localStorage.setItem('wishList', JSON.stringify(this.wishList()));
  }

  private loadWishList(): Movie[] {
    try {
      return JSON.parse(localStorage.getItem('wishList') ?? '[]');
    } catch {
      return [];
    }
  }
}
