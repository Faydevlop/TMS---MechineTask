import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import Sidebar from "@/components/sidebar_user";
import withAuth from "@/components/hoc/withAuth";
import Swal from "sweetalert2";
import EditTaskModal from "@/components/Modals/EditTasks";
import AddTaskModal from "@/components/Modals/TaskModal";
import { toast } from "react-toastify";
import axiosInstance from "@/components/utils/axiosInstance";

const Tasks = () => {
  const [tasks, setTasks] = useState([]); // Local state to store tasks
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
      const [selectedTask, setSelectedTask] = useState(null);

  const userId = useSelector((state) => state.auth.user?._id); // Get userId from Redux

  const openEditModal = (task) => {
    setSelectedTask(task);
    setIsEditModalOpen(true);
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
            `${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`
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

  const handleAddTask = async (task) => {
    try {
      const response = await axiosInstance.post(`${process.env.NEXT_PUBLIC_API_URL}/tasks/`, task, {
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

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/byuser/${userId}`
      );
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) return; // Ensure user is logged in before fetching

    

    fetchTasks();
  }, [userId]); // Run when userId changes

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks/${updatedTask._id}`,
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

  return (
    <div className="flex min-h-screen w-full bg-white text-black">
      <Sidebar />
      <div className="w-full max-w-10xl mx-auto p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <a
            className="px-5 py-2 text-sm font-medium bg-black text-white rounded-lg transition hover:bg-gray-800"
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Task
          </a>
        </div>

        <EditTaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditTask}
          task={selectedTask}
        />

<AddTaskModal
  isOpen={isAddModalOpen}
  onClose={() => setIsAddModalOpen(false)}
  onSave={handleAddTask}
  user={useSelector((state) => state.auth.user)} // Pass user data
/>


        {loading ? (
          <p className="text-gray-600">Loading tasks...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tasks.map((task, index) => (
              <div
                key={task._id || index}
                className="rounded-lg border border-gray-300 bg-white p-4 shadow-sm"
              >
                <h3 className="text-lg font-medium mb-2">{task.title}</h3>
                <p className="text-sm text-gray-600">{task.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs text-gray-500">
                    Due: {task.dueDate || "N/A"}
                  </span>
                 
                  <span className="px-3 py-1 text-xs font-semibold bg-gray-200 text-black rounded-md">
                    {task.priority || "Medium"}
                  </span>
                </div>
                <span className="text-xs  text-gray-500">
                    Status: {task.status || "N/A"}
                  </span>
               

                <div className="flex justify-end gap-3 mt-4">
                  <button onClick={() => openEditModal(task)} className="px-3 py-1 text-xs border border-gray-500 text-black rounded-md transition hover:bg-gray-300">
                    Edit
                  </button>
                  <button onClick={()=>handleDeleteTask(task._id)} className="px-3 py-1 text-xs bg-red-600 text-white rounded-md transition hover:bg-red-700">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default withAuth(Tasks);
