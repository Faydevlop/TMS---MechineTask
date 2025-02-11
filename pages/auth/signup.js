import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../redux/slices/authSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { clearError } from "../../redux/slices/authSlice";

const Signup = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(clearError()); // Clear error when component mounts
  }, [dispatch]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = "name is required";
    if (!formData.email.trim()) tempErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) tempErrors.email = "Invalid email format";
    if (!formData.password) tempErrors.password = "Password is required";
    else if (formData.password.length < 6) tempErrors.password = "Password must be at least 6 characters";
    if (!formData.confirmPassword) tempErrors.confirmPassword = "Confirm password is required";
    else if (formData.password !== formData.confirmPassword) tempErrors.confirmPassword = "Passwords do not match";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const resultAction = await dispatch(signupUser(formData));
    if (signupUser.fulfilled.match(resultAction)) {
      toast.success("Otp send successfull! ");
      router.push("/auth/otp");
    } else {
      toast.error(resultAction.payload || "Signup failed");
      // console.log(resultAction.payload);
      
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="text-gray-500">
            Already have an account? <Link href="/auth/login" className="underline text-blue-600">Sign in</Link>
          </p>
          {error && <p className="text-red-500 text-xs">{error.error}</p>}
{error?.field === "name" && <p className="text-red-500 text-xs">{error.error}</p>}

          

        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(errors).length > 0 && (
            <div className="text-red-500 text-sm"></div>
          )}
          <div className="space-y-1">
            <label className="text-sm font-medium">name</label>
            <input className="w-full border rounded-md px-3 py-2 text-sm" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Email</label>
            <input className="w-full border rounded-md px-3 py-2 text-sm" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Password</label>
            <input className="w-full border rounded-md px-3 py-2 text-sm" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Confirm Password</label>
            <input className="w-full border rounded-md px-3 py-2 text-sm" name="confirmPassword" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={handleChange} />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>
          <button className="bg-black text-white hover:bg-gray-800 h-10 px-4 py-2 w-full rounded-md" type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
