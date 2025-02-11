import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";
import withAuth from "@/components/hoc/withAuth";
import AddTaskModal from "@/components/Modals/TaskModal";
import EditTaskModal from "@/components/Modals/EditTasks"; // Import the EditTaskModal
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axiosInstance from "@/components/utils/axiosInstance";

const Users = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Fetch tasks when the component loads
  const fetchTasks = async () => {
    try {
      const response = await axiosInstance.get(`https://tsm.fayisnambiyath.in/api/tasks`);
      setTasks(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This task will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axiosInstance.delete(
            `https://tsm.fayisnambiyath.in/api/tasks/${taskId}`
          );

          if (response.status === 204) {
            Swal.fire("Deleted!", "The task has been deleted.", "success");

            // Update state immediately
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
          } else {
            throw new Error("Failed to delete task");
          }
        } catch (error) {
          console.error("Error deleting task:", error);
          Swal.fire("Error!", "Failed to delete the task. Try again.", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (task) => {
    try {
      const response = await axiosInstance.post(`https://tsm.fayisnambiyath.in/api/tasks/`, task, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        toast.success("Task added successfully!");
        setIsAddModalOpen(false);
        fetchTasks(); // Fetch latest tasks after adding
      }
    } catch (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task. Please try again.");
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await axiosInstance.put(
        `https://tsm.fayisnambiyath.in/api/tasks/${updatedTask._id}`,
        updatedTask,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        toast.success("Task updated successfully!");
        setIsEditModalOpen(false);
        fetchTasks(); // Refresh tasks after updating
      }
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-center sm:text-left">
            Task Manager
          </h1>
          <button
            className="bg-black text-white hover:bg-primary/90 h-9 rounded-md px-4 text-sm font-medium"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Task
          </button>
        </div>

        <AddTaskModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onSave={handleAddTask}
  user={useSelector((state) => state.auth.user)} // Pass user data
/>


        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditTask}
          task={selectedTask}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="rounded-lg border bg-white p-4 shadow-md flex flex-col justify-between h-full"
            >
              <div className="p-4">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Assigned to: <span className="font-medium">{task.assignedTo?.name || "Unassigned"}</span>
                </p>
                <p className="text-sm text-gray-600 mt-1">
  Due: {new Date(task.dueDate).toLocaleDateString()}
</p>

                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                  {task.description}
                </p>
                <div className="mt-4">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full border">
                    {task.status}
                  </span>
                </div>
              </div>
              <div className="flex justify-end p-4 gap-2 mt-auto">
                <button
                  onClick={() => openEditModal(task)}
                  className="border bg-white hover:bg-blue-100 h-9 rounded-md px-3 text-sm"
                >
                  Edit
                </button>
                {/* <button className="border bg-white hover:bg-green-100 h-9 rounded-md px-3 text-sm">
                  Details
                </button> */}
                <button
                  onClick={() => handleDeleteTask(task._id)}
                  className="border bg-white hover:bg-red-100 h-9 rounded-md px-3 text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Users);
