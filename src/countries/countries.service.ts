import { Injectable } from '@nestjs/common';

@Injectable()
export class CountriesService {
  constructor() {}

  async getCountries() {
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,flags',
      );
      const countries = await response.json();
      return countries;
    } catch (error) {
      console.log(error);
      console.log('error', error.message);
      return [];
    }
  }

  async getCountry(name: string) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}?fields=name`,
      );
      const country = await response.json();
      return country;
    } catch (error) {
      console.log(error);
      console.log('error', error.message);
      return null;
    }
  }

  async getCountryFlag(name: string) {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${name}?fields=flags`,
      );
      const country = await response.json();
      return country[0].flags[0];
    } catch (error) {
      console.log(error);
      console.log('error', error.message);
      return null;
    }
  }
}
