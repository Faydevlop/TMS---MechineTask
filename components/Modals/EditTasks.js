import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";

const EditTaskModal = ({ isOpen, onClose, onSave, task }) => {
  const [editedTask, setEditedTask] = useState(task || {});
  const [users, setUsers] = useState([]);
  const user = useSelector((state) => state.auth.user); // Get logged-in user

  useEffect(() => {
    if (task) setEditedTask(task);
    if (isOpen && user?.role === "admin") fetchUsers();
  }, [task, isOpen, user]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  if (!isOpen || !task) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prevTask) => ({ ...prevTask, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${editedTask._id}`,
        editedTask
      );
      onSave(response.data);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            value={editedTask.title || ""}
            onChange={handleChange}
            placeholder="Title"
            className="w-full border p-2 rounded"
            required
          />

          {/* Show Assigned To dropdown only for admins */}
          {user?.role === "admin" && (
            <select
              name="assignedTo"
              value={editedTask.assignedTo || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}

          <input
            type="date"
            name="dueDate"
            value={editedTask.dueDate ? new Date(editedTask.dueDate).toISOString().split("T")[0] : ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />

          <textarea
            name="description"
            value={editedTask.description || ""}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-2 rounded"
            required
          />

          <select
            name="status"
            value={editedTask.status || ""}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
