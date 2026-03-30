export interface ApiEnvelope<T> {
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface ListQueryParams {
  search?: string;
  page?: number;
  per_page?: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: 'admin' | 'receptionist' | 'veterinarian';
  is_active: boolean;
}

export interface AuthPayload {
  user: User;
  token: string;
}

export interface Client {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  phone: string;
  document_number: string | null;
  address: string | null;
  notes: string | null;
  photo_url: string | null;
  pets_count?: number;
}

export interface Pet {
  id: number;
  client_id: number;
  name: string;
  species: string;
  breed: string | null;
  sex: 'male' | 'female' | 'unknown' | null;
  birth_date: string | null;
  weight: string | null;
  color: string | null;
  microchip_number: string | null;
  allergies: string | null;
  notes: string | null;
  photo_url: string | null;
  is_active: boolean;
  client?: Client;
}

export interface Veterinarian {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  license_number: string;
  specialty: string | null;
  photo_url: string | null;
  is_active: boolean;
}

export interface VeterinaryService {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  duration_minutes: number;
  price: string;
  is_active: boolean;
  quantity?: number;
  unit_price?: string;
}

export interface Appointment {
  id: number;
  pet_id: number;
  veterinarian_id: number;
  scheduled_at: string;
  reason: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  pet?: Pet;
  veterinarian?: Veterinarian;
  services?: VeterinaryService[];
}

export interface ClinicalRecord {
  id: number;
  pet_id: number;
  veterinarian_id: number | null;
  appointment_id: number | null;
  record_date: string;
  diagnosis: string;
  treatment: string | null;
  observations: string | null;
  attachment_url: string | null;
  weight: string | null;
  pet?: Pet;
  veterinarian?: Veterinarian;
  appointment?: Appointment;
}

export interface DashboardSummary {
  clients_count: number;
  pets_count: number;
  veterinarians_count: number;
  appointments_count: number;
  pending_appointments_count: number;
  clinical_records_count: number;
  next_appointments: Appointment[];
}
