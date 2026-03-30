export const routes = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  clients: '/clients',
  veterinarians: '/veterinarians',
  pets: '/pets',
  appointments: '/appointments',
  clinicalRecords: '/clinical-records',
} as const;

export const uiText = {
  noSelectedClient: 'Sin cliente seleccionado',
  noSelectedPet: 'Sin mascota seleccionada',
  noSelectedVeterinarian: 'Sin veterinario seleccionado',
  noAttachment: 'Sin adjunto',
} as const;

export const statusOptions = ['scheduled', 'confirmed', 'completed', 'cancelled'] as const;
export type AppointmentStatus = (typeof statusOptions)[number];
