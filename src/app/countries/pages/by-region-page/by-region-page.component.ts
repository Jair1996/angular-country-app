import { Component, OnInit } from '@angular/core';

import { Country } from '../../interfaces/country.interface';
import { Region } from '../../interfaces/region.type';

import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'countries-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: [],
})
export class ByRegionPageComponent implements OnInit {
  public countries: Country[] = [];
  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  public selectedRegion?: Region;

  constructor(private countriesService: CountriesService) {}

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byRegion.countries;
    this.selectedRegion = this.countriesService.cacheStore.byRegion.region;
  }

  searchRegion(term: Region) {
    this.selectedRegion = term;

    this.countriesService.searchRegion(term).subscribe({
      next: (countries) => {
        this.countries = countries;
      },
    });
  }
}
