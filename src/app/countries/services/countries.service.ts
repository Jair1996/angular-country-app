import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

import { CacheStore } from '../interfaces/cache-store.interface';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  };

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('cachedStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    if (!localStorage.getItem('cachedStore')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cachedStore')!);
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url).pipe(catchError((_) => of([])));
  }

  searchCountryByAlphaCode(term: string): Observable<Country | null> {
    const url = `${this.apiUrl}/alpha/${term}`;

    return this.http.get<Country[]>(url).pipe(
      map((countries) => countries[0] || null),
      catchError((_) => of(null))
    );
  }

  searchCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;

    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore = { ...this.cacheStore, byCapital: { term, countries } };
        this.saveToLocalStorage();
      })
    );
  }
  searchCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;

    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore = { ...this.cacheStore, byCountry: { term, countries } };
        this.saveToLocalStorage();
      })
    );
  }

  searchRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;

    return this.getCountriesRequest(url).pipe(
      tap((countries) => {
        this.cacheStore = { ...this.cacheStore, byRegion: { region, countries } };
        this.saveToLocalStorage();
      })
    );
  }
}
