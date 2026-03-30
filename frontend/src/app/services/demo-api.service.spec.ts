import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { DemoApiService } from './demo-api.service';

describe('DemoApiService', () => {
  let service: DemoApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DemoApiService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DemoApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should map owners from API response', () => {
    let owners: unknown[] = [];

    service.getOwners().subscribe((result) => {
      owners = result;
    });

    const request = httpMock.expectOne('https://jsonplaceholder.typicode.com/users');
    request.flush([
      {
        id: 7,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123-456',
        address: { city: 'La Paz' },
      },
    ]);

    expect(owners).toEqual([
      {
        id: 7,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '123-456',
        city: 'La Paz',
      },
    ]);
  });

  it('should map appointments from todos', () => {
    let appointments: unknown[] = [];

    service.getAppointments().subscribe((result) => {
      appointments = result;
    });

    const request = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos?_limit=12');
    request.flush([
      { id: 1, title: 'Vacuna anual', completed: false, userId: 3 },
      { id: 2, title: 'Control general', completed: true, userId: 4 },
    ]);

    expect(appointments).toEqual([
      {
        id: 1,
        petName: 'Mascota 3',
        ownerName: 'Cliente 3',
        date: '2026-03-18T10:00:00',
        reason: 'Vacuna anual',
        status: 'pending',
      },
      {
        id: 2,
        petName: 'Mascota 4',
        ownerName: 'Cliente 4',
        date: '2026-03-19T10:00:00',
        reason: 'Control general',
        status: 'confirmed',
      },
    ]);
  });

  it('should return fallback photo when API fails', () => {
    let photoUrl = '';

    service.getPetPhoto().subscribe((result) => {
      photoUrl = result;
    });

    const request = httpMock.expectOne('https://dog.ceo/api/breeds/image/random');
    request.flush('error', { status: 500, statusText: 'Server Error' });

    expect(photoUrl).toBe('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg');
  });
});
