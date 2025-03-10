
// Constants for booking system - these will be populated from API

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00",
  "14:00", "15:00", "16:00", "17:00"
];

export const BOOKING_STATUSES = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};

export const PAYMENT_STATUSES = {
  COMPLETED: "COMPLETED",
  PENDING: "PENDING",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED"
};
