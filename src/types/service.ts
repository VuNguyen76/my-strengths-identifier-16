
export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  duration?: number; // Duration in minutes
  categoryId?: string;
  categoryName?: string;
  active?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  image?: string;
  serviceCount?: number;
}

// Specialist type
export interface Specialist {
  id: string;
  name: string;
  role?: string;
  experience?: number | string;
  image?: string;
  bio?: string;
  availability?: string[];
  specialties?: string[];
  rating?: number;
  email?: string;
  phone?: string;
  userId?: string;
  status?: string;
}

// Booking type
export interface Booking {
  id: string;
  service: string | Service;
  specialist: string | Specialist;
  date: string;
  status: string;
  price: number;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  notes?: string;
}

// Transaction type
export interface Transaction {
  id: string;
  date: string;
  service: string | Service;
  amount: number;
  status: string;
  paymentMethod: string;
  bookingId?: string;
}

// Payment Method type
export interface PaymentMethod {
  id: string;
  type: string;
  name: string;
  expiry?: string;
  isDefault: boolean;
}

// Invoice type
export interface Invoice {
  id: string;
  date: string;
  service: string | Service;
  amount: number;
  status: string;
  transactionId: string;
}
