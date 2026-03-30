import { TestBed } from '@angular/core/testing';

import { PetStoreService } from './pet-store.service';

describe('PetStoreService', () => {
  let service: PetStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PetStoreService);
  });

  it('should start with seeded pets', () => {
    const pets = service.pets();

    expect(pets.length).toBe(3);
    expect(pets[0].name).toBe('Luna');
  });

  it('should return a pet by id', () => {
    const pet = service.getById(2);

    expect(pet).toBeTruthy();
    expect(pet?.name).toBe('Milo');
  });

  it('should add a new pet with incremented id', () => {
    const created = service.addPet({
      name: 'Rocky',
      species: 'Dog',
      age: 4,
      ownerId: 1,
      ownerName: 'Leanne Graham',
      imageUrl: 'https://example.com/rocky.jpg',
      vaccineDueDate: '2026-06-01',
    });

    expect(created.id).toBe(4);
    expect(service.pets()[0].name).toBe('Rocky');
    expect(service.pets().length).toBe(4);
  });
});
