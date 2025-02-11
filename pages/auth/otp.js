import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { otpofUser, clearError } from "../../redux/slices/authSlice"; // Adjust the path as needed
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const OtpPage = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, user,isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/user/dashboard");
      toast.success("Registeration successfull! ");
    }
  }, [user, router,isAuthenticated]);

  // Handle OTP input change
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace key
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Resend OTP Timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    }
  }, [timer]);

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    dispatch(otpofUser({ otp: otpCode,email:user.email })).then((res) => {
      if (res.error) {
        setTimeout(() => {
          dispatch(clearError());
        }, 3000);
      }
    });
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Enter OTP</h2>
          <p className="text-gray-600">
            We&apos;ve sent a 6-digit OTP to your email. Please enter it below.
          </p>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center">{error.message || "Invalid OTP"}</p>}

        {/* OTP Inputs */}
        <div className="flex justify-center gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl font-bold border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              maxLength="1"
              type="text"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>

        {/* Submit Button */}
        <button
          className="bg-black text-white hover:bg-gray-800 h-10 w-full rounded-md"
          onClick={handleSubmit}
          disabled={loading || otp.some((digit) => digit === "")}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP Section */}
        <p className="text-center text-sm text-gray-600">
          {timer > 0 ? (
            `Resend OTP in ${timer}s`
          ) : (
            <button
              className="text-blue-600 underline"
              onClick={() => setTimer(30)}
            >
              Resend OTP
            </button>
          )}
        </p>

        <p className="text-center text-sm text-gray-600">
          Entered the wrong email?{" "}
          <Link href="/auth/login" className="underline text-blue-600">
            Go back
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OtpPage;
