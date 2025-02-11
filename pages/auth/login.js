import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/slices/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setFormError("Email and Password are required");
      return;
    }

    setFormError(""); // Clear previous form errors

    const response = await dispatch(loginUser({ email, password }));

    if (response.payload && response.payload.user) {
      const role = response.payload.user.role;
      if (role === "regularuser") {
        router.push("/user/dashboard");
        toast.success("Login successfull! ");
      } else if (role === "admin") {
        router.push("/admin/dashboard");
        toast.success("Login successfull! ");
      } else {
        setFormError("Unauthorized role");
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="mx-4 flex w-full max-w-4xl flex-col lg:flex-row shadow-md rounded-xl bg-white">
        {/* Left Section */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100 p-8 rounded-l-xl">
  <img 
    src="https://images.pexels.com/photos/4050287/pexels-photo-4050287.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
    alt="Login" 
    className="w-full h-full object-cover rounded-l-xl"
  />
</div>


        {/* Right Section - Form */}
        <div className="flex flex-1 flex-col items-center justify-center space-y-6 p-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-gray-600">Enter your credentials to log in</p>
          </div>

          {/* Display validation error */}
          {formError && <p className="text-red-500 text-sm">{formError}</p>}
          {error && <p className="text-red-500 text-sm">{error.error}</p>}

          <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your email"
                
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 rounded-md border px-3 py-2 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter your password"
                
              />
            </div>

            <div className="flex justify-between">
              <Link href="/" className="text-sm text-blue-600 underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              className="bg-black text-white hover:bg-gray-800 h-10 px-4 py-2 w-full rounded-md"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="underline text-blue-600">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
