import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Sidebar from "@/components/sidebar";
import withAuth from "@/components/hoc/withAuth";
import UserEditModal from "@/components/Modals/UserEditModal";
import Link from "next/link";

const Users = ({ users }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userList, setUserList] = useState(users);

  // Open edit modal
  const openModal = (userId) => {
    console.log('here the id',userId);
    
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

//   handle Delete


const handleDelete = async (userId) => {
  if (!userId) return;

  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`);

      Swal.fire("Deleted!", "The user has been deleted.", "success");

      // Refresh the user list after deletion
      setUserList((prevUsers) => prevUsers.filter(user => user.id !== userId));
      refreshUsers()
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire("Error!", "Failed to delete user. Please try again.", "error");
    }
  }
};


  // Refresh users after update
  const refreshUsers = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
      setUserList(response.data);
    } catch (error) {
      console.error("Error refreshing users:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="flex flex-col flex-1 gap-6 p-6">
        <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        </div>
        <div className="bg-white p-4 rounded-lg shadow overflow-auto">
          <table className="w-full text-sm text-gray-700">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    <span className="inline-block bg-blue-500 text-white px-2 py-1 text-xs rounded-full">
                      {user.role} 
                    </span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => openModal(user._id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                      Edit
                    </button>
                    <button onClick={()=>handleDelete(user._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition">
                      Delete
                    </button>
                    <Link href={`/admin/tasks/details/${user._id}`} >
                    <button className="bg-blue-300 text-white px-2 py-1 rounded hover:bg-blue-600 transition">
                      Details
                    </button>
                    </Link>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Edit Modal */}
      <UserEditModal userId={selectedUserId} isOpen={isModalOpen} onClose={closeModal} onUpdate={refreshUsers} />
    </div>
  );
};

// Server-Side Rendering (SSR) to fetch users
export async function getServerSideProps() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`);
    return {
      props: {
        users: response.data,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      props: {
        users: [],
      },
    };
  }
}

export default withAuth(Users);
