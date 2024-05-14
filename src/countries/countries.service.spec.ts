import { Test, TestingModule } from '@nestjs/testing';
import { CountriesService } from './countries.service';

describe('CountriesService', () => {
  let service: CountriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountriesService],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCountries', () => {
    it('should return an array of countries', async () => {
      const result = await service.getCountries();
      expect(result).toEqual([]);
    });
    it('should return an error if fetch fails', async () => {
      jest.spyOn(service, 'getCountries').mockRejectedValue(new Error());
      await expect(service.getCountries()).rejects.toThrow();
    });
  });

  describe('getCountry', () => {
    it('should return a country', async () => {
      const result = await service.getCountry('Nigeria');
      expect(result).toEqual({});
    });
  });

  describe('getCountryFlag', () => {
    it('should return a country flag', async () => {
      const result = await service.getCountryFlag('Nigeria');
      expect(result).toEqual({});
    });
  });
});
