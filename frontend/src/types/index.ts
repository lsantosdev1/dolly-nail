export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number | string;
  durationMin: number;
  active: boolean;
  imageUrl?: string;
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  startTime: string;
  endTime: string;
  status: "PENDING" | "CONFIRMED" | "CANCELED" | "COMPLETED";
  notes?: string;
  client: Client;
  service: Service;
}

export interface CreateAppointmentPayload {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  serviceId: string;
  startTime: string;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}
