const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const API = BASE ? `${BASE}/api` : '/api';

export async function getTrainers() {
  const res = await fetch(`${API}/trainers`);
  if (!res.ok) throw new Error('Failed to fetch trainers');
  return res.json();
}

export async function getTrainer(id) {
  const res = await fetch(`${API}/trainers/${encodeURIComponent(id)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to fetch trainer');
  }
  return res.json();
}

export async function updateTrainer(id, data) {
  const res = await fetch(`${API}/trainers/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to update trainer');
  }
  return res.json();
}

export async function getReservations(date = null, phone = null) {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (phone) params.set('phone', phone);
  const url = `${API}/reservations${params.toString() ? `?${params}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch reservations');
  return res.json();
}

export async function getAvailableSlots(trainer, date) {
  const res = await fetch(
    `${API}/reservations/available?trainer=${encodeURIComponent(trainer)}&date=${encodeURIComponent(date)}`
  );
  if (!res.ok) throw new Error('Failed to fetch available slots');
  return res.json();
}

export async function createReservation(data) {
  const res = await fetch(`${API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create reservation');
  }
  return res.json();
}

export async function updateReservation(id, data) {
  const res = await fetch(`${API}/reservations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to update reservation');
  }
  return res.json();
}

export async function cancelReservation(id) {
  const res = await fetch(`${API}/reservations/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to cancel reservation');
  return res.json();
}
