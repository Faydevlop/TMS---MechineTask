import React from 'react'
import Sidebar from '@/components/sidebar'
import withAuth from '@/components/hoc/withAuth'
import axios from 'axios';
import Link from 'next/link';

const dashboard = ({data}) => {
    console.log(data);
    
  return (
    <div className="flex min-h-screen w-full">
        <Sidebar/>
  <div className="flex-1 flex flex-col">
    <header className="bg-background border-b flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10 md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="4" x2="20" y1="12" y2="12"></line>
            <line x1="4" x2="20" y1="6" y2="6"></line>
            <line x1="4" x2="20" y1="18" y2="18"></line>
          </svg>
          <span className="sr-only">Toggle Menu</span>
        </button>
        <Link href="/admin/dashboard" className="flex items-center gap-2">
  <span className="font-semibold text-lg">Admin Dashboard</span>
</Link>
      </div>
      <div className="flex items-center gap-4"></div>
    </header>
    <main className="flex-1 p-6 grid gap-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Total Users</h3>
            <p className="text-sm text-muted-foreground">All registered users</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-4xl font-bold">{data ? data.tasks.length : "Loading..."}</div>
          </div>
        </div>
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
          <div className="flex flex-col space-y-1.5 p-6">
            <h3 className="text-2xl font-semibold leading-none tracking-tight">Active Tasks</h3>
            <p className="text-sm text-muted-foreground">Ongoing tasks</p>
          </div>
          <div className="p-6 pt-0">
            <div className="text-4xl font-bold">{data ? data.tasks.length : "Loading..."}</div>
          </div>
        </div>
        
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        
       
      </div>
    </main>
  </div>
</div>
  )
}

// Fetch data with SSR
export async function getServerSideProps() {
    try {
      const response = await axios.get(`https://tsm.fayisnambiyath.in/api/admin/dashboard`);
      console.log("API Response:", response.data);
  
      return {
        props: {
          data: response.data || {},
        },
      };
    } catch (error) {
      console.error("Error fetching data:", error);
      return {
        props: {
          data: {},
        },
      };
    }
  }

export default withAuth(dashboard) 


