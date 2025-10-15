import React, { useEffect, useState } from "react";
import { getAllDonations, createDonation, updateDonation, deleteDonation } from "../services/donationService";

export default function DonationManager() {
  const [donations, setDonations] = useState([]);
  const [form, setForm] = useState({ category: "", item: "", quantity: 1, donor: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch donations on component mount
  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const data = await getAllDonations();
      setDonations(data);
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!form.category || !form.item || !form.donor) return;

    try {
      if (editingId) {
        await updateDonation(editingId, form);
        setEditingId(null);
      } else {
        await createDonation(form);
      }
      setForm({ category: "", item: "", quantity: 1, donor: "" });
      fetchDonations(); // Refresh table
    } catch (err) {
      console.error("Error saving donation:", err);
    }
  };

  const handleEdit = (donation) => {
    setForm(donation);
    setEditingId(donation.id);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDonation(id);
      fetchDonations(); // Refresh table
    } catch (err) {
      console.error("Error deleting donation:", err);
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

        <input name="item" placeholder="Item name" value={form.item} onChange={handleChange} required />
        <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} required />
        <input name="donor" placeholder="Donor name or organization" value={form.donor} onChange={handleChange} required />

        <button type="submit" className="btn primary">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {donations.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "18px", color: "#555", marginTop: "30px" }}>No donations made</p>
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
                  <button className="btn primary" onClick={() => handleEdit(donation)}>Edit</button>
                  <button className="btn danger" onClick={() => handleDelete(donation.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
