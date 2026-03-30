import { Injectable, signal } from '@angular/core';

import { Pet } from '../models/types';

const INITIAL_PETS: Pet[] = [
  {
    id: 1,
    name: 'Luna',
    species: 'Dog',
    age: 3,
    ownerId: 1,
    ownerName: 'Leanne Graham',
    imageUrl: 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg',
    vaccineDueDate: '2026-04-10',
  },
  {
    id: 2,
    name: 'Milo',
    species: 'Cat',
    age: 2,
    ownerId: 2,
    ownerName: 'Ervin Howell',
    imageUrl: 'https://images.dog.ceo/breeds/terrier-yorkshire/n02094433_1395.jpg',
    vaccineDueDate: '2026-03-22',
  },
  {
    id: 3,
    name: 'Nina',
    species: 'Other',
    age: 1,
    ownerId: 3,
    ownerName: 'Clementine Bauch',
    imageUrl: 'https://images.dog.ceo/breeds/poodle-miniature/n02113799_1592.jpg',
    vaccineDueDate: '2026-05-01',
  },
];

@Injectable({ providedIn: 'root' })
export class PetStoreService {
  private readonly petsSignal = signal<Pet[]>(INITIAL_PETS);

  readonly pets = this.petsSignal.asReadonly();

  getById(id: number): Pet | undefined {
    return this.petsSignal().find((pet) => pet.id === id);
  }

  addPet(newPet: Omit<Pet, 'id'>): Pet {
    const nextId = Math.max(...this.petsSignal().map((pet) => pet.id), 0) + 1;
    const pet = { id: nextId, ...newPet };
    this.petsSignal.update((pets) => [pet, ...pets]);
    return pet;
  }
}
