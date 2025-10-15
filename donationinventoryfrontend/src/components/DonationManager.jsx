import React, { useEffect, useState } from "react";
import config from "../config"; // import config.js

// =======================
// Donation Service (inside same file)
// =======================
async function handleResponse(res) {
  if (res.status === 204) return null; // DELETE returns 204
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  return res.json();
}

async function getAllDonations() {
  const res = await fetch(config.url);
  return handleResponse(res);
}

async function createDonation(donation) {
  const res = await fetch(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });
  return handleResponse(res);
}

async function updateDonation(id, donation) {
  const res = await fetch(`${config.url}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donation),
  });
  return handleResponse(res);
}

async function deleteDonation(id) {
  const res = await fetch(`${config.url}/${id}`, { method: "DELETE" });
  if (res.status === 204) return true;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP error ${res.status}`);
  }
  return true;
}

// =======================
// DonationManager Component
// =======================
export default function DonationManager() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ category: "", item: "", quantity: 1, donor: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
      alert("Failed to fetch donations!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "quantity" ? parseInt(value) : value });
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.category || !form.item || !form.donor) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      if (editingId) {
        await updateDonation(editingId, form);
        alert("Donation updated successfully!");
        setEditingId(null);
      } else {
        await createDonation(form);
        alert("Donation added successfully!");
      }
      setForm({ category: "", item: "", quantity: 1, donor: "" });
      fetchDonations();
    } catch (err) {
      console.error("Error saving donation:", err);
      if (editingId) alert("Failed to update donation!");
      else alert("Failed to add donation!");
    }
  };

  const handleCancel = () => {
    if (editingId) {
      alert("Update canceled");
      setEditingId(null);
    } else {
      alert("Add canceled");
    }
    setForm({ category: "", item: "", quantity: 1, donor: "" });
  };

  const handleEdit = (donation) => {
    setForm({ ...donation });
    setEditingId(donation.id);
  };

  const handleDelete = async (id) => {
    if (!id) {
      alert("Invalid donation ID.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this donation?")) return;

    try {
      await deleteDonation(id);
      alert("Donation deleted successfully!");
      fetchDonations();
    } catch (err) {
      console.error("Error deleting donation:", err);
      alert("Failed to delete donation!");
    }
  };

  return (
    <div className="app-container">
      <h1>Donation Inventory Tracker</h1>

      <form onSubmit={handleAddOrUpdate} className="donation-form">
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select category</option>
          <option value="Clothing">Clothing</option>
          <option value="Food">Food</option>
          <option value="Medicine">Medicine</option>
          <option value="Books">Books</option>
          <option value="Others">Others</option>
        </select>

        <input
          name="item"
          placeholder="Item name"
          value={form.item}
          onChange={handleChange}
          required
        />
        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          required
        />
        <input
          name="donor"
          placeholder="Donor name or organization"
          value={form.donor}
          onChange={handleChange}
          required
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" className="btn primary">
            {editingId ? "Update" : "Add"}
          </button>
          <button type="button" className="btn secondary" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>

      {donations.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#555", marginTop: "30px" }}>
          No donations made
        </p>
      ) : (
        <table className="donation-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Donor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id}>
                <td>{donation.category}</td>
                <td>{donation.item}</td>
                <td>{donation.quantity}</td>
                <td>{donation.donor}</td>
                <td className="actions">
                  <button className="btn primary" onClick={() => handleEdit(donation)}>
                    Edit
                  </button>
                  <button className="btn danger" onClick={() => handleDelete(donation.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
