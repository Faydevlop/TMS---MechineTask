import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const user = useSelector((state) => state.auth.user); // Get user from Redux state

    useEffect(() => {
      if (!user) {
        router.replace("/auth/login"); // Redirect to login if not authenticated
      }
    }, [user]);

    if (!user) return null; // Prevent rendering before redirect

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
