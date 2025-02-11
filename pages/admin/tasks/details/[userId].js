import React from 'react';
import axios from 'axios';
import Sidebar from '@/components/sidebar';
import withAuth from '@/components/hoc/withAuth';
import Image from 'next/image';

const Details = ({ user }) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* User Profile Card */}
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="relative flex shrink-0 overflow-hidden rounded-full h-12 w-12">
                <Image
                  className="aspect-square h-full w-full"
                  alt="User Avatar"
                  width={1260}  // Set appropriate width
                  height={750}
                  src={user?.profilePicture || "https://tailwindui.com/placeholder-user.jpg"}
                />
              </span>
              <div>
                <h1 className="text-2xl font-bold">{user?.name || "John Doe"}</h1>
                <p className="text-muted-foreground">{user?.email || "john@example.com"}</p>
              </div>
            </div>
          </div>

          {/* Assigned Tasks Section */}
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Assigned Tasks</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Task 1 */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold">Finish Quarterly Report</h3>
                  <p className="text-sm text-muted-foreground">
                    Compile data and write up the Q4 report for the executive team.
                  </p>
                  <span className="text-sm text-muted-foreground">Due: April 15, 2023</span>
                  <span className="text-sm text-primary">Priority: High</span>
                </div>
                <div className="flex justify-end p-4 gap-2">
                  <button className="border px-3 py-2 rounded-md hover:bg-accent">Edit</button>
                  <button className="border px-3 py-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white">
                    Delete
                  </button>
                </div>
              </div>

              {/* Task 2 */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold">Redesign Company Website</h3>
                  <p className="text-sm text-muted-foreground">
                    Update the website with the new branding and features.
                  </p>
                  <span className="text-sm text-muted-foreground">Due: May 31, 2023</span>
                  <span className="text-sm text-secondary">Priority: Medium</span>
                </div>
                <div className="flex justify-end p-4 gap-2">
                  <button className="border px-3 py-2 rounded-md hover:bg-accent">Edit</button>
                  <button className="border px-3 py-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white">
                    Delete
                  </button>
                </div>
              </div>

              {/* Task 3 */}
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold">Implement New CRM System</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up the new CRM system and train the sales team.
                  </p>
                  <span className="text-sm text-muted-foreground">Due: June 20, 2023</span>
                  <span className="text-sm text-warning">Priority: Low</span>
                </div>
                <div className="flex justify-end p-4 gap-2">
                  <button className="border px-3 py-2 rounded-md hover:bg-accent">Edit</button>
                  <button className="border px-3 py-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

// Fetch user data using SSR
export async function getServerSideProps(context) {
  const { userId } = context.params; // Get userId from URL parameters
  
  try {
    const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${context.req.cookies.token}`, // Ensure auth headers are included if needed
      },
    });

    return {
      props: {
        user: data || null,
      },
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {
      props: {
        user: null,
      },
    };
  }
}

export default withAuth(Details);
