// src/services/donationService.js
const BASE_URL = "http://localhost:8080/api/donations";

async function handleResponse(res) {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  if (res.status === 204) return null; // No content
  return res.json();
}

export async function getAllDonations() {
  const res = await fetch(BASE_URL);
  return handleResponse(res);
}

export async function createDonation(donation) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });
  return handleResponse(res);
}

export async function updateDonation(id, donation) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });
  return handleResponse(res);
}

export async function deleteDonation(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
