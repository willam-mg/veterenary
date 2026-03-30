export interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
}

export interface Pet {
  id: number;
  name: string;
  species: 'Dog' | 'Cat' | 'Other';
  age: number;
  ownerId: number;
  ownerName: string;
  imageUrl: string;
  vaccineDueDate: string;
}

export interface Appointment {
  id: number;
  petName: string;
  ownerName: string;
  date: string;
  reason: string;
  status: 'pending' | 'confirmed';
}
