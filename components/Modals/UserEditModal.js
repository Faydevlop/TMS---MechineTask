import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";

const UserEditModal = ({ userId, isOpen, onClose, onUpdate }) => {
  const [user, setUser] = useState({ name: "", email: "", role: "regularuser" });
  const [loading, setLoading] = useState(false);

  // Fetch user details when the modal is opened
  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      console.log("API URL:", `https://tsm.fayisnambiyath.in/api/admin/users/${userId}`);

      setLoading(true);
      try {
        const res = await axios.get(`https://tsm.fayisnambiyath.in/api/admin/users/${userId}`);
        console.log("Fetched user data:", res.data); // Debug log
        setUser({
          name: res.data.name,
          email: res.data.email,
          role: res.data.role || "regularuser", // Default to 'regularuser' if not set
        });
      } catch (err) {
        console.error("Error fetching user details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, isOpen]);

  // Handle input change
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle update request
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`https://tsm.fayisnambiyath.in/api/admin/users/${userId}`, user);
      onUpdate(); // Refresh user list
      onClose(); // Close modal
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!isOpen) return null; // Hide modal if it's not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                disabled
                type="email"
                name="email"
                value={user.email}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                value={user.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              >
                <option value="admin">Admin</option>
                <option value="regularuser">Regular User</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserEditModal;
