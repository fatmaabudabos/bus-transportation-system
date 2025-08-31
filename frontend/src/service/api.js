const API_BASE = 'http://localhost:3000';

export const api = {
  // Auth
  login: (credentials) => 
    fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    }).then(res => res.json()),

  signup: (userData) =>
    fetch(`${API_BASE}/auth/signup`, {
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    }).then(res => res.json()),

  // Trips
  searchTrips: (params) =>
    fetch(`${API_BASE}/trips/search?${new URLSearchParams(params)}`)
      .then(res => res.json()),

  // Bookings
  createBooking: (bookingData) =>
    fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    }).then(res => res.json()),

  // Admin
  createTrip: (tripData) =>
    fetch(`${API_BASE}/admin/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    }).then(res => res.json()),

  updateTrip: (id, tripData) =>
    fetch(`${API_BASE}/admin/trips/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tripData)
    }).then(res => res.json()),

  deleteTrip: (id) =>
    fetch(`${API_BASE}/admin/trips/${id}`, { method: 'DELETE' })
      .then(res => res.json())
};