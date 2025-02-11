import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Sidebar from '@/components/sidebar_user';
import axiosInstance from '@/components/utils/axiosInstance';

const Dashboard = () => {
  const userId = useSelector((state) => state.auth?.user?._id);
  const [taskCounts, setTaskCounts] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
  });

  useEffect(() => {
    if (!userId) return;

    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`https://tsm.fayisnambiyath.in/api/tasks/byuser/${userId}`);
        const tasks = response.data; 

        // Categorizing tasks based on their status
        const total = tasks.length;
        const completed = tasks.filter(task => task.status === 'completed').length;
        const inProgress = tasks.filter(task => task.status === 'in-progress').length;

        setTaskCounts({ total, completed, inProgress });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [userId]);

  return (
    <div className="flex min-h-screen w-full bg-white text-black">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-6 p-6 md:pl-14 md:pr-6 md:pt-6">
        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
         
        </header>

        <main className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Total Tasks', count: taskCounts.total, icon: '📋' },
              { title: 'Completed Tasks', count: taskCounts.completed, icon: '✅' },
             
            ].map((card, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-between p-5 border border-gray-300 rounded-lg bg-white shadow-sm"
              >
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <div className="text-3xl font-bold">{card.count}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
