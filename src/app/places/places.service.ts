import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay } from 'rxjs/operators';

import { AuthService } from '../auth/auth.service';
import { Place } from './places.model';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  private _places = new BehaviorSubject<Place[]>([
    new Place(
      'p1',
      'Manhattan Mansion',
      'In the heart of New York City',
      'https://images.unsplash.com/photo-1515263487990-61b07816b324?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      149.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'aaaa'
    ),
    new Place(
      'p2',
      "L'Amour ToujoursManhattan Mansion",
      'A romantic place in Paris',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8YXBhcnRtZW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      199.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'xyz'
    ),
    new Place(
      'p3',
      'Hot Accra Bed',
      'Not your average trip',
      'https://images.unsplash.com/photo-1527030280862-64139fba04ca?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      99.99,
      new Date('2019-01-01'),
      new Date('2019-12-31'),
      'abc'
    ),
  ]);

  get places() {
    // return [...this._places];
    return this._places.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getPlace(id: string) {
    return this.places.pipe(
      take(1),
      map((places) => {
        return { ...places.find((p) => p.id === id) };
      })
    );
    // return { ...this._places.find((p) => p.id === id) };
  }

  addPalce(
    title: string,
    description: string,
    price: number,
    dateFrom: Date,
    dateTo: Date
  ) {
    const newPlace = new Place(
      Math.random().toString(),
      title,
      description,
      'https://images.unsplash.com/photo-1527030280862-64139fba04ca?ixid=MXwxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
      price,
      dateFrom,
      dateTo,
      this.authService.userId
    );
    console.log('about to push');
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        this._places.next(places.concat(newPlace));
      })
    );
  }

  updatePlace(placeId: string, title: string, description: string) {
    return this.places.pipe(
      take(1),
      delay(1000),
      tap((places) => {
        const updatedPlaceIndex = places.findIndex((pl) => pl.id === placeId);
        const updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(
          oldPlace.id,
          title,
          description,
          oldPlace.imageUrl,
          oldPlace.price,
          oldPlace.availableFrom,
          oldPlace.availableTo,
          oldPlace.userId
        );
        this._places.next(updatedPlaces);
      })
    );
  }
}
