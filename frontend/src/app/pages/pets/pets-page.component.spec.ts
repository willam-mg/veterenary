import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { Owner } from '../../models/types';
import { DemoApiService } from '../../services/demo-api.service';
import { PetStoreService } from '../../services/pet-store.service';
import { PetsPageComponent } from './pets-page.component';

describe('PetsPageComponent', () => {
  let fixture: ComponentFixture<PetsPageComponent>;
  let component: PetsPageComponent;

  const owners: Owner[] = [
    {
      id: 1,
      name: 'Leanne Graham',
      email: 'leanne@example.com',
      phone: '111-222',
      city: 'Santa Cruz',
    },
  ];

  const apiMock = {
    getOwners: jasmine.createSpy('getOwners').and.returnValue(of(owners)),
    getPetPhoto: jasmine
      .createSpy('getPetPhoto')
      .and.returnValue(of('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg')),
  };

  const petStoreMock = {
    pets: signal([] as unknown[]).asReadonly(),
    addPet: jasmine.createSpy('addPet').and.returnValue({ id: 4 }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetsPageComponent],
      providers: [
        { provide: DemoApiService, useValue: apiMock },
        { provide: PetStoreService, useValue: petStoreMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PetsPageComponent);
    component = fixture.componentInstance;
  });

  it('should load owners on init', () => {
    component.ngOnInit();

    expect(apiMock.getOwners).toHaveBeenCalled();
    expect(component.owners().length).toBe(1);
    expect(component.petForm.controls.ownerId.value).toBe(1);
  });

  it('should not submit when form is invalid', () => {
    component.ngOnInit();
    component.petForm.patchValue({ name: '' });

    component.submit();

    expect(petStoreMock.addPet).not.toHaveBeenCalled();
  });

  it('should add pet when form is valid', () => {
    component.ngOnInit();
    component.petForm.patchValue({
      name: 'Nala',
      species: 'Cat',
      age: 2,
      ownerId: 1,
      vaccineDueDate: '2026-05-10',
    });

    component.submit();

    expect(apiMock.getPetPhoto).toHaveBeenCalled();
    expect(petStoreMock.addPet).toHaveBeenCalledWith(
      jasmine.objectContaining({
        name: 'Nala',
        species: 'Cat',
        age: 2,
        ownerId: 1,
      }),
    );
    expect(component.message()).toBe('Mascota creada correctamente.');
    expect(component.petForm.controls.name.value).toBe('');
  });
});
