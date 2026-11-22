import { Component, inject, OnInit, computed} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {
  
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  private movieService=inject(MovieService)
  
  isInWish = computed(() =>
    this.movieService.wishList().some(m => m.id === this.movieService.selectedMovie()?.id)
  );
  ngOnInit(): void {
    
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id!)
      })).subscribe(movie=>this.movieService.selectedMovie.set(movie))
  }
 addToWish(movie: any) {
    if (movie) {
      this.movieService.addToWish(movie);
    }
  }
   backToMovieList() {
    this.router.navigate(['/']);
  }
  }