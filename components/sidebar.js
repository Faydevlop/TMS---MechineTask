import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();

  const setLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      {/* Burger Button for Mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
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
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-background border-r fixed top-0 left-0 bg-white h-full w-64 p-6 transition-transform transform md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:flex md:flex-col md:relative md:h-auto`}
      >
        <Link href="/admin/dashboard" className="flex items-center gap-2 mb-8">
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
            <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
          </svg>
          <span className="font-semibold text-lg">Admin Dashboard</span>
        </Link>

        <nav className="flex-1 space-y-2">
          {[
            { href: "/admin/dashboard", label: "Dashboard" },
            { href: "/admin/users", label: "Users" },
            { href: "/admin/tasks", label: "Tasks" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                pathname === item.href ? "bg-blue-100" : "hover:bg-muted"
              }`}
            >
              <span>{item.label}</span>
            </Link>
          ))}

          {/* Logout Button */}
          <button
            onClick={setLogout}
            className="w-full text-left flex items-center gap-2 px-4 py-2 rounded-md transition-colors hover:bg-red-200"
          >
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
