import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Appointment, Owner } from '../models/types';

interface JsonUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: { city: string };
}

interface JsonTodo {
  id: number;
  title: string;
  completed: boolean;
  userId: number;
}

interface DogApiResponse {
  message: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class DemoApiService {
  private readonly http = inject(HttpClient);

  getOwners(): Observable<Owner[]> {
    return this.http.get<JsonUser[]>('https://jsonplaceholder.typicode.com/users').pipe(
      map((users) =>
        users.map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.address.city,
        })),
      ),
    );
  }

  getAppointments(): Observable<Appointment[]> {
    return this.http
      .get<JsonTodo[]>('https://jsonplaceholder.typicode.com/todos?_limit=12')
      .pipe(
        map((todos) =>
          todos.map((todo, index) => {
            const day = (index % 10) + 18;
            return {
              id: todo.id,
              petName: `Mascota ${todo.userId}`,
              ownerName: `Cliente ${todo.userId}`,
              date: `2026-03-${String(day).padStart(2, '0')}T10:00:00`,
              reason: todo.title,
              status: todo.completed ? 'confirmed' : 'pending',
            } as Appointment;
          }),
        ),
      );
  }

  getPetPhoto(): Observable<string> {
    return this.http.get<DogApiResponse>('https://dog.ceo/api/breeds/image/random').pipe(
      map((response) => response.message),
      catchError(() => of('https://images.dog.ceo/breeds/hound-afghan/n02088094_1003.jpg')),
    );
  }
}
