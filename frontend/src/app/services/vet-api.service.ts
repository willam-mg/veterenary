import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { apiConfig } from '../core/config/api.config';
import {
  ApiEnvelope,
  Appointment,
  Client,
  ClinicalRecord,
  DashboardSummary,
  ListQueryParams,
  PaginatedResponse,
  Pet,
  User,
  Veterinarian,
  VeterinaryService,
} from '../models/types';

@Injectable({ providedIn: 'root' })
export class VetApiService {
  private readonly http = inject(HttpClient);

  getDashboard(): Observable<DashboardSummary> {
    return this.get<DashboardSummary>('dashboard');
  }

  getUsers(): Observable<User[]> {
    return this.get<User[]>('users');
  }

  getClients(params: ListQueryParams = {}): Observable<PaginatedResponse<Client>> {
    return this.get<PaginatedResponse<Client>>('clients', params);
  }

  createClient(payload: FormData | Record<string, unknown>): Observable<Client> {
    return this.post<Client>('clients', payload);
  }

  updateClient(id: number, payload: FormData | Record<string, unknown>): Observable<Client> {
    return this.post<Client>(`clients/${id}?_method=PUT`, payload);
  }

  deleteClient(id: number): Observable<void> {
    return this.delete(`clients/${id}`);
  }

  getPets(params: ListQueryParams = {}): Observable<PaginatedResponse<Pet>> {
    return this.get<PaginatedResponse<Pet>>('pets', params);
  }

  createPet(payload: FormData | Record<string, unknown>): Observable<Pet> {
    return this.post<Pet>('pets', payload);
  }

  updatePet(id: number, payload: FormData | Record<string, unknown>): Observable<Pet> {
    return this.post<Pet>(`pets/${id}?_method=PUT`, payload);
  }

  deletePet(id: number): Observable<void> {
    return this.delete(`pets/${id}`);
  }

  getVeterinarians(params: ListQueryParams = {}): Observable<PaginatedResponse<Veterinarian>> {
    return this.get<PaginatedResponse<Veterinarian>>('veterinarians', params);
  }

  createVeterinarian(payload: FormData | Record<string, unknown>): Observable<Veterinarian> {
    return this.post<Veterinarian>('veterinarians', payload);
  }

  updateVeterinarian(id: number, payload: FormData | Record<string, unknown>): Observable<Veterinarian> {
    return this.post<Veterinarian>(`veterinarians/${id}?_method=PUT`, payload);
  }

  deleteVeterinarian(id: number): Observable<void> {
    return this.delete(`veterinarians/${id}`);
  }

  getVeterinaryServices(): Observable<VeterinaryService[]> {
    return this.get<VeterinaryService[]>('veterinary-services');
  }

  getAppointments(params: ListQueryParams = {}): Observable<PaginatedResponse<Appointment>> {
    return this.get<PaginatedResponse<Appointment>>('appointments', params);
  }

  createAppointment(payload: Record<string, unknown>): Observable<Appointment> {
    return this.post<Appointment>('appointments', payload);
  }

  updateAppointment(id: number, payload: Record<string, unknown>): Observable<Appointment> {
    return this.put<Appointment>(`appointments/${id}`, payload);
  }

  deleteAppointment(id: number): Observable<void> {
    return this.delete(`appointments/${id}`);
  }

  getClinicalRecords(params: ListQueryParams = {}): Observable<PaginatedResponse<ClinicalRecord>> {
    return this.get<PaginatedResponse<ClinicalRecord>>('clinical-records', params);
  }

  createClinicalRecord(payload: FormData | Record<string, unknown>): Observable<ClinicalRecord> {
    return this.post<ClinicalRecord>('clinical-records', payload);
  }

  updateClinicalRecord(id: number, payload: FormData | Record<string, unknown>): Observable<ClinicalRecord> {
    return this.post<ClinicalRecord>(`clinical-records/${id}?_method=PUT`, payload);
  }

  deleteClinicalRecord(id: number): Observable<void> {
    return this.delete(`clinical-records/${id}`);
  }

  private get<T>(path: string, query: ListQueryParams = {}): Observable<T> {
    return this.http
      .get<ApiEnvelope<T>>(`${apiConfig.baseUrl}/${path}`, { params: this.buildParams(query) })
      .pipe(map((response) => response.data));
  }

  private post<T>(path: string, payload: unknown): Observable<T> {
    return this.http
      .post<ApiEnvelope<T>>(`${apiConfig.baseUrl}/${path}`, payload)
      .pipe(map((response) => response.data));
  }

  private put<T>(path: string, payload: unknown): Observable<T> {
    return this.http
      .put<ApiEnvelope<T>>(`${apiConfig.baseUrl}/${path}`, payload)
      .pipe(map((response) => response.data));
  }

  private delete(path: string): Observable<void> {
    return this.http
      .delete<ApiEnvelope<null>>(`${apiConfig.baseUrl}/${path}`)
      .pipe(map(() => void 0));
  }

  private buildParams(query: ListQueryParams): HttpParams {
    let params = new HttpParams();

    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return params;
  }
}
