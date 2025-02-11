import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import axiosInstance from "../utils/axiosInstance";

const AddTaskModal = ({ isOpen, onClose, onSave, user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [assignedTo, setAssignedTo] = useState(user.role === "admin" ? "" : user._id);
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (isOpen && user.role === "admin") {
        axiosInstance
        .get(`https://tsm.fayisnambiyath.in/api/admin/users`)
        .then((res) => setUsers(res.data))
        .catch((err) => console.error("Error fetching users:", err));
    }
  }, [isOpen, user.role]);

  const handleSubmit = () => {
    if (!title.trim() || !description.trim() || !dueDate) {
      toast.error("Title, Description, and Due Date are required!");
      return;
    }

    const taskData = {
      title,
      description,
      status,
      assignedTo,
      dueDate,
    };

    onSave(taskData);
    onClose(); // Close modal after saving
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Add Task</h2>

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        ></textarea>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          disabled={user.role !== "admin"} // Disable if not admin
        >
          {user.role === "admin" ? (
            <>
              <option value="">Select User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </>
          ) : (
            <option value={user._id}>{user.name} (You)</option>
          )}
        </select>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;
